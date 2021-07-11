library(magrittr)
library(plumber)

# source('utils.R')
# source('gmail.R')

comments <- readr::read_csv('../../lda_data/data/comment_id.csv')

#* @filter cors
cors <- function(req, res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  res$setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
  res$setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res$setHeader('Vary', 'Origin')
  
  plumber::forward()
}


#################################################################
########### api for email #####################################
#################################################################



# #* POST send email
# #* @post /sendEmail
# #* @options /sendEmail
# #* @param sub Subject to find SME
# #* @param temp Email template to use 
# #* @param userEmail User's email
# #* @param commentIds:[chr] 
# #* @param userNotes 
# function(req, res){
#   if(req$REQUEST_METHOD == "OPTIONS"){
#     return("Is valid request")
#   }
#   
#   if(req$REQUEST_METHOD == "POST"){
#     print(req$args)
#     sendEmail(req$args$sub, 
#               req$args$temp, 
#               req$args$userEmail,
#               req$args$commentIds,
#               req$args$userNotes)
#   }
# }
# 
# #* GET possible Subjects
# #* @get /subjects
# function(){
#   sort(smeData$subject)
# }
# 
# #* GET possible templates
# #* @get /templates
# function(){
#   templates %>%
#     dplyr::select(name, description) %>%
#     dplyr::arrange(name)
# }


####################################################################
#################### api for dedup + model #########################
##################################################################3333333

#* GET rules
#* @get /rules
#* @param agency
function(agency = NULL){
  files <- dir('../../dedup/data/')
  
  if(!is.null(agency)){
    bool <- stringr::str_detect(files, stringr::regex(agency, ignore_case = T))
    files <- files[bool]
  }
  
  files <- stringr::str_remove(files, '.csv$')
  
  return(files)
}

#* GET comments
#* @get /comments
#* @param rule
function(rule){
  dta <- readr::read_csv(paste0('../../dedup/data/', rule, '.csv'))
}

#* GET Topics
#* @get /topics
#* @param agency [usda, epa]
function(agency){
  topics <- readRDS(paste0('../../lda_data/data/', agency, '_topics.rds'))
  dockets <- readRDS(paste0('../../lda_data/data/', agency, '_dockets.rds'))
  return(list(
    topics=topics,
    dockets=dockets
  ))
}

#* GET ALL DOCKETS
#* @get /all_dockets
#* @serializer unboxedJSON
function(){
  dockets <- readRDS('../../lda_data/data/epa_usda_dockets.rds')
  topics <- readRDS('../../lda_data/data/epa_usda_topics.rds')
  return(
    list(topics = topics, dockets=dockets)
  )
}

#* GET Docket Comments
#* @get /docket
#* @param did docket id
#* @param top topic 
function(did=NA, top=NA){
  if(is.na(did)) return(comments)
  if(is.na(top)) return(dplyr::filter(comments, docket_id == did))
  return(dplyr::filter(comments, docket_id == did, topic == top))
}

#* GET comments v2
#* @get /commentsv2
#* @param cid:[chr] comment id
function(req, res){
  return(dplyr::filter(comments, id %in% req$args$cid))
}

#* POST an array
#* @post /test
#* @options /test
#* @param array:[chr]
function(req, res){
  together <- paste(req$args$array, collapse = ", ")
  print(together)
}

