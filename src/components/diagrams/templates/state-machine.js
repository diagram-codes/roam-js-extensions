export default `
"LoggedOut" as out
"LoggedIn" as in

START->out
out->in["login success"]
in->out["logout"]
out->out["login failure"]
in->in["read secret"]
in->error["disk failure"]

`