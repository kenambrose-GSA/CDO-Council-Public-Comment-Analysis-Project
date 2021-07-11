all_stakeholders <- readr::read_csv('../../dedup/dont_keep/all stakeholders sample data v2.csv')
epa_comments_lda <- readr::read_csv('../../lda_data/epa_total_lda_ids.csv')[,c('id', 'docket_id')]
usda_comments_lda <- readr::read_csv('../../lda_data/usda_total_lda.csv')

epa_comments_stake <- all_stakeholders %>%
  dplyr::filter(id1 %in% epa_comments_lda$id | id2 %in% epa_comments_lda$id) %>%
  {
    tibble::tibble(
      id = c(.$id1, .$id2),
      comment = c(.$comm1, .$comm2)
    )
  } %>%
  dplyr::distinct()  %>%
  dplyr::left_join(
    dplyr::select(epa_comments_lda, docket_id, id)
  )

usda_comments_stake <- usda_comments_lda %>%
  dplyr::select(docket_id, id, comment) %>%
  dplyr::distinct()

comment_ids <- rbind(usda_comments_stake, epa_comments_stake)
readr::write_csv(comment_ids, '../../lda_data/data/comment_id.csv')

comment_ids <- readr::read_csv('../../lda_data/data/comment_id.csv')
usda_topics <- readr::read_csv('../../lda_data/data/usda_topic_docs.csv')
epa_topics <- readr::read_csv('../../lda_data/data/epa_topic_docs.csv')
comment_ids <- dplyr::left_join(
  comment_ids,
  rbind(usda_topics, epa_topics)
)

readr::write_csv(comment_ids, '../../lda_data/data/comment_id.csv')
