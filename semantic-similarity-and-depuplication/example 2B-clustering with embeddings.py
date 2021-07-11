import pandas as pd
import numpy as np
from sklearn.cluster import DBSCAN


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


# cluster embeddings using DBSCAN. Feel free to use other
# https://scikit-learn.org/stable/modules/generated/sklearn.cluster.DBSCAN.html
X = np.stack(comm_embed_df.embed)
clustering = DBSCAN().fit(X)

# after clustering the embeddings, we can
# note, in DBSCAN cluster label -1 means "no cluster" (see link posted above)
cluster_labels = clustering.labels_

#
print(len(cluster_labels))
print(len(comm_embed_df))

print(pd.Series(cluster_labels).value_counts())

comm_embed_df['cluster_label'] = cluster_labels
# print out examples of some comments that belong to cluster 2
print(comm_embed_df[comm_embed_df['cluster_label']==2]['comment'].head(10))
