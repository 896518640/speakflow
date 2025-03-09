import { ref } from 'vue';
import { io } from 'socket.io-client';

export const useSpeechRtAsr = (options = {}) => {
    const socket = io('ws://localhost:3000');
    const isRecording = ref(false);
    const translatedText = ref('');

    let audioContext: AudioContext | null = null;
    let mediaStream: MediaStream | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;
    let audioBuffer = [];

    const SAMPLE_RATE = options.sampleRate || 16000;
    const BUFFER_SIZE = 512; // 32ms for 16KHz
    const CHANNELS = 1;

    const floatTo16BitPCM = (input) => {
        const output = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
            const s = Math.max(-1, Math.min(1, input[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output;
    };

    const initRecording = async () => {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    sampleRate: SAMPLE_RATE,
                    channelCount: CHANNELS,
                    noiseSuppression: true,
                    echoCancellation: false,
                },
            });

            audioContext = new AudioContext({ sampleRate: SAMPLE_RATE });
            const source = audioContext.createMediaStreamSource(mediaStream);
            scriptProcessor = audioContext.createScriptProcessor(BUFFER_SIZE, CHANNELS, CHANNELS);

            scriptProcessor.onaudioprocess = (e) => {
                const channelData = e.inputBuffer.getChannelData(0);
                const pcm16 = floatTo16BitPCM(channelData);
                audioBuffer.push(...pcm16);
                if (audioBuffer.length >= 640) { // 40ms for 16KHz
                    const chunk = new Int16Array(audioBuffer.slice(0, 640)).buffer;
                    socket.emit('audio-chunk', chunk);
                    audioBuffer = audioBuffer.slice(640);
                }
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
        } catch (error) {
            console.error('录音初始化失败:', error);
            throw error;
        }
    };

    const startRecording = () => {
        if (!isRecording.value) {
            isRecording.value = true;
            socket.emit('start-recording');
            initRecording();
        }
    };

    const stopRecording = () => {
        if (isRecording.value) {
            isRecording.value = false;
            socket.emit('audio-end');
            if (audioContext) {
                audioContext.close();
            }
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }

            if (scriptProcessor) {
                scriptProcessor.disconnect();
            }
        }
    };

    const handleTranslation = (data) => {
        const result = data.data ? JSON.parse(data.data).cn.st.rt.reduce((text, rt) => {
            return text + rt.ws.reduce((wsText, ws) => wsText + ws.cw[0].w, '');
        }, '') : '';
        translatedText.value += result;
    }

    const handleError = (error) => {
        console.error('Socket.IO error:', error.message);
    }


    onMounted(() => {
        socket.on('translation', handleTranslation);
        socket.on('error', handleError);
    });

    onUnmounted(() => {
        socket.off('translation', handleTranslation);
        socket.off('error', handleError);
        socket.disconnect();
    });

    return {
        isRecording,
        translatedText,
        startRecording,
        stopRecording,
    };
};