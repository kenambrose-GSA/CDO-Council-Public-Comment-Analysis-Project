smeData <- read.csv('../data/sme-directory.csv')
templates <- read.csv('../data/templates.csv')
  
getSme <- function(sub, data = smeData){
  sme <- data %>%
    dplyr::filter(subject == sub) %>%
    as.list()
  
  return(sme)
}

getTemplate <- function(temp, data = templates){
  temp_loc <- data %>%
    dplyr::filter(name == temp) %>%
    as.list()
  
  return(temp_loc)
}

fillTemplate <- function(sme, user, temp){
  temp_str <- temp$location %>%
    readLines() %>% 
    paste0(collapse = "") %>%
    stringr::str_replace_all('__SME-FIRST__', sme$first) %>%
    stringr::str_replace_all('__USER-EMAIL__', user$email) %>%
    stringr::str_replace_all("__USER-NOTES__", user$notes) %>%
    stringr::str_replace_all("__COMMENT-IDS__", user$comments)
  
  return(temp_str)
}

# test <- fillTemplate(fakeSme, fakeUser, 'test')
# getSme('Data Engineering')
