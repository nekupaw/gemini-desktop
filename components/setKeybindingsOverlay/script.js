const shortcutObjs = document.querySelectorAll('.btn');
shortcutObjs[0].innerText = window.electron.getLocalStorage('shortcutA');
shortcutObjs[1].innerText = window.electron.getLocalStorage('shortcutB');

function format(array) {
    return array.join(' + ').toLowerCase();
}


const register = a => {
    let shortcut = [];

    document.addEventListener('keydown', e => shortcut.push(e.key));
    document.addEventListener('keyup', e => {
        a.target.innerText = format(shortcut.splice(0, 3));
    }, {once: true})
}

shortcutObjs.forEach(a => {
    a.onclick = (a) => {
        a.target.innerText = "enter keybinding"
        register(a);
    }
})


document.querySelector('.done').onclick = () => {
    window.electron.setLocalStorage('shortcutA', shortcutObjs[0]);
    window.electron.setLocalStorage('shortcutB', shortcutObjs[1]);
    window.electron.close();
}

document.querySelector('.cancel').onclick = () => {
    window.electron.close();
}
