## for more information on how to create an app and produce a configure.json
## go to https://developers.google.com/gmail/api/quickstart/python

gmailr::gm_auth_configure(path="../data/client_secret_703349382708-3qrdr44jun59f9u2og3kba4baqen7386.apps.googleusercontent.com.json")

## If token doesn't already exist, need to create one locally and load it manually to the hosted environment
# gmailr::gm_auth(cache = '../data/.secret')

gmailr::gm_auth(email=T, cache="../data/.secret")

sendEmail <- function(sub, temp, userEmail, commentIds, userNotes){
  sme <- getSme(sub)

  tmp <- getTemplate(temp)
  usr <- list(email=userEmail,
              comments=paste(commentIds, collapse = ", "),
              notes=userNotes)
  print(usr)
  
  html <- fillTemplate(sme, usr, tmp)

  msg <- gmailr::gm_mime() %>%
    gmailr::gm_to(sme$email) %>%
    gmailr::gm_from("discoverylabdeveloper@gmail.com") %>%
    gmailr::gm_subject(tmp$subject) %>%
    gmailr::gm_html_body(html)
  
  gmailr::gm_send_message(msg)
  
  return("success")
}
