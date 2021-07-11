library(magrittr)
library(igraph)


sim = readr::read_csv('sample_data3.csv')

docs = tibble::tibble(
    id = c(sim$id1, sim$id2), 
    text = c(sim$comm1, sim$comm2)
  ) %>%
  dplyr::distinct()

g <- sim %>%
  dplyr::select(-c(index, `Unnamed: 0`)) %>%
  graph_from_data_frame(directed = F)

clust <- cluster_louvain(g)
comp <- components(g)

V(g)$comp <- comp$membership #attachment exists in component
V(g)$clust <- clust$membership #clustering algorithm to group

top1comp <- which(comp$csize >= sort(comp$csize, decreasing = T))[1]
top3comp <- which(comp$csize >= sort(comp$csize, decreasing = T)[3])

g_largest <- g %>%
  {. - V(.)[!comp %in% top1comp]}

plot(g_largest, 
     vertex.label = '', 
     vertex.color = V(g_largest)$clust,
     vertex.size = 5)

comments <- as_data_frame(g, 'vertices') %>%
  dplyr::arrange(clust) %>%
  dplyr::left_join(docs, by= c("name" = "id"))

ordered_comments <- comments %>%
  dplyr::group_by(clust) %>%
  tidyr::nest() %>%
  dplyr::mutate(data = purrr::map(data, function(x){
    x$clust_order <- 1:nrow(x)
    return(x)
  })) %>%
  tidyr::unnest(cols = c(data)) %>%
  dplyr::ungroup() %>%
  dplyr::group_by(comp) %>%
  tidyr::nest() %>%
  dplyr::mutate(data = purrr::map(data, function(x){
    x$comp_order <- 1:nrow(x)
    return(x)
  }))  %>%
  tidyr::unnest(cols =c(data)) %>%
  dplyr::ungroup() %>%
  dplyr::select(
    name, clust, clust_order, comp, comp_order, text
  )

readr::write_csv(ordered_comments, "clustered_comments.csv")
jsonlite::toJSON(ordered_comments) %>%
  write('clustered_comments.json')

############################################################
######### creating clusters ################################
############################################################

clusterDocs <- function(df, ids = c('id1', 'id2')){
  df <- dplyr::select(df, dplyr::all_of(ids))
  
  g <- igraph::graph_from_data_frame(df, directed = F)
  
  clust <- igraph::cluster_louvain(g)
  comp <- igraph::components(g)
  
  V(g)$comp <- comp$membership #attachment exists in component
  V(g)$clust <- clust$membership #clustering algorithm to group
  
  newdf = igraph::as_data_frame(g, 'vertices')
  return(newdf)
}

createDocs <- function(df, ids = c('id1', 'id2'), text = c('comm1', 'comm2')){
  ids = purrr::map(ids, function(x){df[[x]]})
  ids = do.call(c, ids)
  
  txt = purrr::map(text, function(x){df[[x]]})
  txt = do.call(c, txt)
  
  newdf <- tibble::tibble(
    id = ids, 
    text = txt
  ) 
  newdf <- dplyr::distinct(newdf)
  return(newdf)
}

orderGroups <- function(df, grp){
  newdf <- df %>%
    dplyr::group_by(!!rlang::sym(grp)) %>%
    tidyr::nest() %>%
    dplyr::mutate(data = purrr::map(data, function(x){
      x[[paste0(grp, "_order")]] <- 1:nrow(x)
      return(x)
    })) %>%
    tidyr::unnest(cols = c(data)) %>%
    dplyr::ungroup()
  
  return(newdf)
}

tagDocs <- function(df, ids = c('id1', 'id2'), text = c('comm1', 'comm2')){
  docs <- createDocs(df, ids, text)
  clust <- clusterDocs(df, ids)
  
  newdf <- dplyr::left_join(clust, docs, by= c("name" = "id"))
  
  newdf <- orderGroups(newdf, "comp") 
  
  newdf <- orderGroups(newdf, "clust")
  
  return(newdf)
}

test <- tagDocs(sim)

#/////

stake <- readr::read_csv('all stakeholders sample data v2.csv')

topEPA <- stake  %>%
  dplyr::group_by(doc_id) %>%
  dplyr::count(sort = T) %>%
  head() %>%
  .$doc_id

testDocs <- stake %>%
  dplyr::filter(
    stringr::str_detect(doc_id, '^USDA') | doc_id %in% topEPA
  ) %>%
  .$doc_id %>%
  unique


test <- stake %>% 
  dplyr::filter(doc_id == testDocs[1]) %>%
  tagDocs()

lapply(testDocs, function(id){
  tmp <- dplyr::filter(stake, doc_id == id)
  dedup <- tagDocs(tmp) 
  dedup$rule = id
  readr::write_csv(dedup, paste0('data/', id, '.csv'))
})

