import nltk 
nltk.download('punkt')
nltk.download('stopwords')

import sys, re
import pylab as plt
from nltk.tokenize import word_tokenize 
from nltk.corpus import stopwords 
from nltk.stem.porter import PorterStemmer
from hlda.sampler import HierarchicalLDA

import string, glob

stopset = stopwords.words('english') + list(string.punctuation) + ['will', 'also', 'said']

import pandas 

comments = pandas.read_csv('COMMENTSFILE.CSV')
#fs_df = comments[comments['agency_id']=='FS'].reset_index(drop=True)
test_df = comments
#test_df = comments[comments['docket_id']=='FS-2019-0023'].reset_index(drop=True)
#test_df = test_df.sample(5000)
#test_df = comments

corpus, all_docs = [], []
vocab = set()

scratch_corpus = test_df.comment.values.tolist()

stemmer = PorterStemmer()
for c in scratch_corpus:
    c = str(c)
    c = re.sub('\S*@\S*\s?', '', c)  # remove emails
    c = re.sub('\s+', ' ', c)  # remove newline chars
    c = re.sub('\n', ' ', c)  # remove newline chars
    c = re.sub("\'", "", c)  # remove single quotes
    c = c.encode('ascii', 'ignore').decode()
    c = c.lower()

    tokens = word_tokenize(str(c))
    filtered = []
    for w in tokens:
        w = stemmer.stem(w.lower()) # use Porter's stemmer
        if len(w) < 3: # remove short tokens
            continue
        if w in stopset: # remove stop words
            continue
        filtered.append(w)
        vocab.update(filtered)
        corpus.append(filtered)
        
print(len(corpus))


# In[12]:


vocab = sorted(list(vocab))
vocab_index = {}
for i, w in enumerate(vocab):
    vocab_index[w] = i

print(len(vocab), len(corpus), len(corpus[0]), len(corpus[1]))


# In[17]:


new_corpus = []
for doc in corpus:
    new_doc = []
    for word in doc:
        word_idx = vocab_index[word]
        new_doc.append(word_idx)
    new_corpus.append(new_doc)

print(len(vocab), len(new_corpus))
print(corpus[0][0:10])
print(new_corpus[0][0:10])


# In[20]:


n_samples = 100
alpha = 10.0 # smoothing over level distributions
gamma = 1.0 # CRP smoothing parameter; number of imaginary customers at next, as yet unused table
eta = 0.1 # smoothing over topic-word distributions
num_levels = 3 # the number of levels in the tree
display_topics = 50 # the number of iterations between printing a brief summary of the topics so far
n_words = 5 # the number of most probable words to print for each topic after model estimation
with_weights = True # whether to print the words with the weights

print("samples? ", n_samples)

# In[21]:


hlda = HierarchicalLDA(new_corpus, vocab, alpha=alpha, gamma=gamma, eta=eta, num_levels=num_levels)
res = hlda.estimate(n_samples, display_topics=display_topics, n_words=n_words, with_weights=with_weights)

with open('results_hlda_usda_500.csv', 'w') as f: 
    f.write(res)

