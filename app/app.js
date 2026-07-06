const CHARS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const lenSlider = document.getElementById('password-length');
const lenVal = document.getElementById('length-val');
const qtySlider = document.getElementById('quantity');
const qtyVal = document.getElementById('quantity-val');
const outputContainer = document.getElementById('output-container');
const btnGenerate = document.getElementById('btn-generate');
const btnCopyAll = document.getElementById('btn-copy-all');
const copyAllText = document.getElementById('copy-all-text');

function toggleSwitch(id) {
    const checkbox = document.getElementById(id);
    const btn = document.getElementById(`switch-${id}-btn`);
    const dot = document.getElementById(`switch-${id}-dot`);
    
    checkbox.checked = !checkbox.checked;

    const anyChecked = ['uppercase', 'lowercase', 'numbers', 'symbols'].some(k => document.getElementById(k).checked);
    if (!anyChecked) {
        checkbox.checked = !checkbox.checked;
        return;
    }

    if (checkbox.checked) {
        btn.classList.remove('bg-zinc-800');
        btn.classList.add('bg-indigo-600');
        dot.classList.remove('bg-zinc-400', 'translate-x-0');
        dot.classList.add('bg-white', 'translate-x-5');
    } else {
        btn.classList.remove('bg-indigo-600');
        btn.classList.add('bg-zinc-800');
        dot.classList.remove('bg-white', 'translate-x-5');
        dot.classList.add('bg-zinc-400', 'translate-x-0');
    }

    generatePasswords();
}

function generateSinglePassword(length, options) {
    let pool = '';
    if (options.uppercase) pool += CHARS.uppercase;
    if (options.lowercase) pool += CHARS.lowercase;
    if (options.numbers) pool += CHARS.numbers;
    if (options.symbols) pool += CHARS.symbols;

    let result = '';
    const randomValues = new Uint32Array(length);
    window.crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
        result += pool[randomValues[i] % pool.length];
    }
    return result;
}

function generatePasswords() {
    const length = parseInt(lenSlider.value);
    const quantity = parseInt(qtySlider.value);
    
    const options = {
        uppercase: document.getElementById('uppercase').checked,
        lowercase: document.getElementById('lowercase').checked,
        numbers: document.getElementById('numbers').checked,
        symbols: document.getElementById('symbols').checked
    };

    outputContainer.innerHTML = '';

    for (let i = 0; i < quantity; i++) {
        const password = generateSinglePassword(length, options);
        const row = document.createElement('div');
        row.className = 'py-1 px-2 hover:bg-zinc-800/40 rounded transition-colors break-all text-zinc-300 select-all cursor-pointer flex justify-between items-center group';
        
        const safePassword = password.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        
        row.innerHTML = `
            <span>${safePassword}</span>
            <span class="material-icons-round text-sm text-zinc-600 group-hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all ml-2" style="font-size: 14px;">content_copy</span>
        `;

        row.onclick = () => {
            navigator.clipboard.writeText(password).then(() => {
                const icon = row.querySelector('.material-icons-round');
                icon.innerText = 'done';
                icon.classList.remove('text-zinc-600', 'text-zinc-400');
                icon.classList.add('text-green-400');
                
                setTimeout(() => {
                    icon.innerText = 'content_copy';
                    icon.classList.remove('text-green-400');
                    icon.classList.add('text-zinc-600');
                }, 1000);
            });
        };

        outputContainer.appendChild(row);
    }
}

btnCopyAll.onclick = () => {
    const passwordElements = outputContainer.querySelectorAll('div > span:first-child');
    const allPasswords = Array.from(passwordElements).map(el => el.innerText).join('\n');
    
    if (!allPasswords) return;

    navigator.clipboard.writeText(allPasswords).then(() => {
        const originalText = copyAllText.innerText;
        copyAllText.innerText = 'Скопировано!';
        btnCopyAll.classList.add('border-green-500/50', 'text-green-400');
        
        setTimeout(() => {
            copyAllText.innerText = originalText;
            btnCopyAll.classList.remove('border-green-500/50', 'text-green-400');
        }, 1500);
    });
};

lenSlider.oninput = (e) => {
    lenVal.innerText = e.target.value;
    generatePasswords();
};

qtySlider.oninput = (e) => {
    qtyVal.innerText = e.target.value;
    generatePasswords();
};

btnGenerate.onclick = generatePasswords;

generatePasswords();