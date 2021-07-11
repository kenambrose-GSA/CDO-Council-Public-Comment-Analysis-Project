import pandas as pd
from tqdm import tqdm

from sentence_transformers import SentenceTransformer


def make_embed_as_df(ids:list, comments:list, lang_model:SentenceTransformer):
    '''from a list of ids and their corresponding comments, return a dataframe'''
    embedding_tens = lang_model.encode(comments)
    embeds = [embedding_tens[i] for i in tqdm(range(len(embedding_tens)))]

    return pd.DataFrame({'id': ids, 'comment': comments, 'embed': embeds})