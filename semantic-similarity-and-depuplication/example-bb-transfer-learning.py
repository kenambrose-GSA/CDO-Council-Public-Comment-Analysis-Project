import os
from glob import glob

import pandas as pd
import csv

from datetime import datetime

from sklearn.model_selection import train_test_split
from torch.utils.data import DataLoader

from sentence_transformers import SentenceTransformer, models, util, InputExample, losses, evaluation
from sentence_transformers.evaluation import EmbeddingSimilarityEvaluator


def load_data(in_df:pd.DataFrame):
    '''function to healp us load data '''
    data_list = list()
    for index, row in in_df.iterrows():
        data_list.append(InputExample(texts=[row['#1 String'],
                                             row['#2 String']],
                                      label=float(row['Quality'])))
    return data_list

# Directory for data that has paired comments and labels indicating if they're semantically similar or not.
DATA_DIR = '/floyd/input/mrpc-data/'
# location of trained model
MODEL_DIR = 'path-to-model-directory-here'
# name of new model
MODEL_NAME = 'new-model'
# location to save new model
MODEL_SAVE_PATH = '/floyd/home/training_mrpc_continue_training-' + MODEL_NAME.split('/')[-1] + '-' + datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

# number of epochs to train model. use small number epochs and revaluate model performance, too many epochs can
# overtrain the mode
NUM_EPOCHS = 1

# make directory for new model if it doesn't exist
if not os.path.exists(MODEL_SAVE_PATH):
    os.makedirs(MODEL_SAVE_PATH)

# this example was done with the microsoft paraphrase reasearch corpus, but this is where you import data for your agency
mrpc_full_train = pd.read_csv(DATA_DIR + 'msr_paraphrase_train.txt', sep='\t', quoting=csv.QUOTE_NONE)

# for every dataset you bring in, it's important to split the data into what the model will actually train on and some
# data that you can assess model performance
mrpc_train, mrpc_val = train_test_split(mrpc_full_train, test_size=0.2, random_state=2021)
mrpc_train = mrpc_train.reset_index(drop=True)
mrpc_val = mrpc_val.reset_index(drop=True)
mrpc_test = pd.read_csv(DATA_DIR + 'msr_paraphrase_test.txt', sep='\t', quoting=csv.QUOTE_NONE)

data_obj = load_data(mrpc_train)

# create pytorch dataloader for training data
train_dataloader = DataLoader(data_obj, shuffle=True, batch_size=1)

print('********data import complete, next step language model instantiation')

# full sentence transformer version of bigbird
bigbird_model = SentenceTransformer(MODEL_DIR)

print('********language model download/set up complete, next step training data object creation')
train_loss = losses.CosineSimilarityLoss(bigbird_model)
evaluator = evaluation.EmbeddingSimilarityEvaluator(sentences1 = mrpc_val['#1 String'],
                                                    sentences2 = mrpc_val['#2 String'],
                                                    scores = mrpc_val['Quality'],
                                                    name='mrpc-val',
                                                    write_csv = True)

print('********training data object creation complete, next step training')
# Tune the model on the training data
bigbird_model.fit(train_objectives=[(train_dataloader, train_loss)],
                  epochs=NUM_EPOCHS,
                  warmup_steps=200,
                  evaluator=evaluator,
                  evaluation_steps=200,
                  output_path = MODEL_SAVE_PATH)

print('********files in output path:')
# after training, save the model to the directory we created before
print(glob(MODEL_SAVE_PATH))


print('********training complete, next step evaluation on test set')
# load stored model and evaluate language model performance on the unseen test dataset
bigbird_model = SentenceTransformer(MODEL_SAVE_PATH)
test_evaluator = EmbeddingSimilarityEvaluator(sentences1 = mrpc_test['#1 String'],
                                              sentences2 = mrpc_test['#2 String'],
                                              scores = mrpc_test['Quality'],
                                              name='mrpc-test',
                                              write_csv = True)
test_evaluator(bigbird_model, output_path=MODEL_SAVE_PATH)

print('********evaluation on test set complete, last part of program')
