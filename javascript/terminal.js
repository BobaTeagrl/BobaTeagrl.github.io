export function initTerminalTyping() {
    const commands = [
        'list',
        'view --filter=recent',
        'Thanks For Looking!',
        'scan --depth=all',
        'ur - mom',
        'analyze --mode=artistic'
    ];

    const input = document.querySelector('.command-input');
    if (!input) return;

    let index = 0;

    function type() {
        const cmd = commands[index];
        let i = 0;
        input.value = '';

        const timer = setInterval(() => {
            if (i < cmd.length) {
                input.value += cmd[i++];
            } else {
                clearInterval(timer);
                setTimeout(() => {
                    index = (index + 1) % commands.length;
                    type();
                }, 3000);
            }
        }, 100);
    }

    setTimeout(type, 2000);
}
