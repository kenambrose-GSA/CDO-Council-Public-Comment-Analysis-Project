import pandas as pd
import numpy as np
import torch
from sentence_transformers import util


# directories where comment data
DATA_DIR = 'data/'
# same as DATA_DIR, but you might want to change directories
OUTPUT_DIR = 'data/'
# set threshold for cosines similarity to determine if two comment pairs are similar
SCORE_THRESH = 0.85

# example dataset
comm_df = pd.read_json(DATA_DIR + 'example-data.json')
# this is a dataframe with the comment id, the comment, and the embedding of the comment
# this JSON was produced by "example 1-encode text general use.py"
embed_df = pd.read_json(DATA_DIR + 'comments with embeddings.json')

# combine example dataset with the text embeddings we generated
comm_embed_df = pd.merge(left=comm_df, right=embed_df.drop(columns='comment'), on='id')


# turn embeddings into pytorch tensors
embedding_tens = torch.from_numpy(np.stack(comm_embed_df.embed))

# create matrix of cosine similarities between comment embeddings
cosine_scores = util.pytorch_cos_sim(embedding_tens, embedding_tens)

# turn above cosine similarity score matrix into a flat data object
cos_scores_flat = set()
# we keep track of indices counted so we don't have duplicates
# this is because the cosine_score matrix is symmetric. EG cosine_scores[7][10] = cosine_scores[10][7]
id_set = set()

# iterate through cosine_scores matrix
for i in range(len(cosine_scores)):
    for j in range(len(cosine_scores)):
        # kick out diagonal values, that is the cosine similarity of a comment on itself

        if i != j and cosine_scores[i][j].item() > SCORE_THRESH:
            # create set of an id combination, this gets stored in the id_set
            id_combo = frozenset([i, j])
            # if an id combo isn't in the id_set, we add it to the flat data object we created above
            if id_combo not in id_set:
                docket_id = comm_embed_df.docket_id[i]
                document_obj_id = comm_embed_df.comment_on[i]
                id1 = comm_embed_df.id[i]
                id2 = comm_embed_df.id[j]
                comm1 = comm_embed_df.comment[i]
                comm2 = comm_embed_df.comment[j]
                score = cosine_scores[i][j].item()
                cos_scores_flat.add(tuple([docket_id, document_obj_id, id1, id2, comm1, comm2, score]))
            id_set.add(id_combo)

temp_res_df = pd.DataFrame(cos_scores_flat,
                           columns=['docket_id', 'document_obj_id', 'id1', 'id2', 'comm1', 'comm2', 'score'])
temp_res_df.to_json(DATA_DIR + 'paired-data.json')
