

document.getElementById('themeChange').addEventListener ('click', changeTheme)

function changeTheme(){
    let body = document.querySelector('body')
    body.classList.toggle('dark')

}