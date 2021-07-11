library(magrittr)

epa <- readr::read_csv('../../lda_data/epa_total_lda_ids.csv')
epa_topics <- readr::read_csv('../../lda_data/epa_total_topics.csv')

x <- epa_topics %>%
  dplyr::rename(topic = X1) %>%
  tidyr::pivot_longer(
    !topic
  )  %>% 
  dplyr::group_by(topic) %>%
  tidyr::nest(.key ="words") %>%
  dplyr::mutate(words = lapply(words, function(x){c(x$value)})) 
%>%
  jsonlite::toJSON()

y = jsonlite::fromJSON(x)

dir.create('../../lda_data/data')
write(x, '../../lda_data/data/epa_topics.json')
saveRDS(x, '../../lda_data/data/epa_topics.rds')

y <- readRDS('../../lda_data/data/epa_topics.rds')
x <- jsonlite::read_json('../../lda_data/data/epa_topics.json', auto_unbox=T)
jsonlite::toJSON(x, auto_unbox = T)

epa_docs <- epa %>% 
  dplyr::select(-X1) %>%
  tidyr::pivot_longer(-c(id, docket_id), names_to = 'topic', values_to = 'likeliness') %>%
  dplyr::group_by(id) %>%
  dplyr::top_n(1)

readr::write_csv(epa_docs, '../../lda_data/data/epa_topic_docs.csv')

epa_dockets <-  epa_docs %>%
  dplyr::group_by(docket_id, topic) %>%
  dplyr::count(sort = T) %>% 
  dplyr::ungroup() %>%
  tidyr::nest(topics = c(topic, n)) %>%
  dplyr::mutate(topics = purrr::map(topics, function(x){
    if(nrow(x) <= 5) return(x)
    first <- x[1:5,]
    first$data = NULL
    later <- tibble::tibble(topic = "Other", n = sum(x[6:nrow(x), 'n']), data = list(x[6:nrow(x),]))
    dplyr::bind_rows(first, later)
  })) %>%
  dplyr::mutate(comment_count = vapply(topics, function(x){sum(x$n)}, numeric(1))) %>%
  dplyr::arrange(desc(comment_count))

epa_dockets <- saveRDS(epa_dockets, '../../lda_data/data/epa_dockets.rds')

#####################################333

getTopics <- function(topicFile){
  readr::read_csv(topicFile) %>%
    dplyr::rename(topic = X1) %>%
    tidyr::pivot_longer(
      !topic
    )  %>% 
    dplyr::group_by(topic) %>%
    tidyr::nest(.key ="words") %>%
    dplyr::mutate(words = lapply(words, function(x){c(x$value)})) 
}

#why is lda input inconsistent..... some have comments stemmed, some don't have id
getDocumentTopics <- function(ldaIdFile){
  readr::read_csv(ldaIdFile) %>%
    dplyr::select(-c(X1, stemmed, comment)) %>%
    tidyr::pivot_longer(-c(id, docket_id), names_to = 'topic', values_to = 'likeliness') %>%
    dplyr::group_by(id) %>%
    dplyr::top_n(1)
}

topics = c("topic_0", "topic_1", "topic_2", "topic_3", "topic_4", "topic_5", "topic_6", "topic_7", "topic_8", "topic_9", "Other")
clrs = c('#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99')
names(clrs) <- topics 

summarizeDockets <- function(docTopics){
  docTopics %>%
    dplyr::rename(name = topic) %>%
    dplyr::group_by(docket_id, name) %>%
    dplyr::count(sort = T, name = 'value') %>% 
    dplyr::ungroup() %>%
    tidyr::nest(children = c(name, value)) %>%
    dplyr::mutate(children = purrr::map(children, function(x){
      x <- dplyr::mutate(x, color = vapply(name, function(x){clrs[[x]]}, character(1))) 
      if(nrow(x) <= 5) return(x)
      first <- x[1:5,]
      first$children = NULL
      later <- tibble::tibble(name = "Other",
                              value = sum(x[6:nrow(x), 'value']), 
                              children = list(x[6:nrow(x),]),
                              color = clrs[['Other']])
      dplyr::bind_rows(first, later)
    })) %>%
    dplyr::mutate(comment_count = vapply(children, function(x){sum(x$value)}, numeric(1))) %>%
    dplyr::arrange(desc(comment_count)) %>%
    dplyr::rename(name = docket_id)
}

z <- summarizeDockets(x)
saveRDS(z, '../../lda_data/data/epa_dockets.rds')

zz <- summarizeDockets(readr::read_csv('../../lda_data/data/usda_topic_docs.csv'))


z <- readRDS('../../lda_data/data/epa_dockets.rds')
zz <- readRDS('../../lda_data/data/usda_dockets.rds') 

combo <- list(name="agencies", children = list(
  list(name="epa", children=z),
  list(name="usda", children=zz)
))

saveRDS(combo, '../../lda_data/data/epa_usda_dockets.rds')

a <- readRDS('../../lda_data/data/epa_topics.rds')
aa <- readRDS('../../lda_data/data/usda_topics.rds')

saveRDS(list(epa=a, usda=aa), '../../lda_data/data/epa_usda_topics.rds')


x <- getTopics('usda_total_topics.csv')
y <- getDocumentTopics('usda_total_lda.csv')
z <- summarizeDockets(y)

saveRDS(x, 'data/usda_topics.rds')
readr::write_csv(y, 'data/usda_topic_docs.csv')
saveRDS(zz, '../../lda_data/data/usda_dockets.rds')

yy <- readr::read_csv('../../lda_data/data/usda_topic_docs.csv')
zz <- summarizeDockets(yy)
saveRDS(zz, '../../lda_data/data/usda_dockets.rds')

y <- readr::read_csv('../../lda_data/data/epa_topic_docs.csv')
z <- summarizeDockets(y)
saveRDS(z, '../../lda_data/data/epa_dockets.rds')
