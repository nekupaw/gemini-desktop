const shortcutObjs = document.querySelectorAll('.btn');

const register = (btn) => {
    let shortcut = [];

    document.addEventListener('keydown', e => shortcut.push(e.key));
    document.addEventListener('keyup', e => {
        if (e.keyCode !== 8){
            btn.target.innerText = format(shortcut.splice(0, 3));
        } else btn.target.innerText = "";
        shortcut.length = 0;
    }, { once: true });
}

function format(array) {
    return array.join(' + ').toLowerCase();
}

async function main(){
    shortcutObjs[0].innerText = await window.electron.getLocalStorage('shortcutA');
    // shortcutObjs[1].innerText = await window.electron.getLocalStorage('shortcutB');

    shortcutObjs.forEach(btn => {
        btn.onclick = (event) => {
            btn.innerText = "enter keybinding";
            register(event);
        }
    });

    document.querySelector('.done').onclick = () => {
        window.electron.setLocalStorage('shortcutA', shortcutObjs[0].innerText);
        // window.electron.setLocalStorage('shortcutB', shortcutObjs[1].innerText);
        window.electron.close();
    }

    document.querySelector('.cancel').onclick = () => {
        window.electron.close();
    }

}

main();
