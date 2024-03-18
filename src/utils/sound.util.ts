import soundBeep from '/sound/beep-29.mp3';
import soundClear from '/sound/button-21.mp3';

const sound = new Audio();

function playSound(src: string) {
    // Detener y liberar la instancia de audio existente
    sound.pause();
    sound.currentTime = 0;

    // Utilizar la instancia de audio global
    sound.src = src;
    sound.play();
    sound.onended = () => { 
        // Puedes realizar otras acciones después de que el sonido ha terminado
    };
}

export const clearSound = () => playSound(soundClear);
export const addSound = () => playSound(soundBeep);
