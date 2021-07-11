import pandas as pd

from embedtext import make_embed_as_df
from sentence_transformers import SentenceTransformer

# comment data directories
DATA_DIR = 'data/'
# location of trained model, or name of huggignface model https://huggingface.co/models
MODEL_DIR = 'path-to-model-directory-here'
# same as DATA_DIR, but you might want to change directories
OUTPUT_DIR = 'data/'


# function to quickly remove new line characters from text
def clean_text(in_text):
    '''comments had a lot of new line characters, this function removes them.'''
    out_text = in_text.replace('\n', ' ')
    return out_text.strip()


### instantiate language model, this will turn the text into embeddings
model = SentenceTransformer(MODEL_DIR)

### import data.
# the goal of this section is to produce a python list of text (not pandas series of text) so the language model can encode the text.
# do any text cleaning here

doc_comm_df = pd.read_json(DATA_DIR + 'example-data.json')

# comment ids. Important to track so we can connect comments with their embeddings after we encode the comments
comm_ids = list(doc_comm_df.id)

# comment text, cleaned with our function defined above
comms = [clean_text(s) for s in doc_comm_df.comment]

### create dataframe containing comment id, comment, and embeddings associated with comment dataframe
output_df = make_embed_as_df(comm_ids, comms, model)

### write out embedded comments to file
output_df.to_json(OUTPUT_DIR + 'comments with embeddings.json')
