// ローカルストレージからリクエストを取得
let requests = JSON.parse(localStorage.getItem('songRequests')) || [];

// Google Apps ScriptのURL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbw0-J_fOQLYw8fR4gm2S6OFq6gzOErqMwA0QPlHx4Mi56RLlUjvJWeIHNRzPP8JcuPuRw/exec';

// リクエスト一覧を表示
function displayRequests() {
    const list = document.getElementById('requestList');
    list.innerHTML = '';
    requests.forEach((request, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${request.artist} - ${request.song}</strong><br>
            演奏: ${request.playParts.join(', ')}<br>
            募集: ${request.recruitParts.join(', ') || 'なし'}
        `;
        list.appendChild(li);
    });
}

// チェックされたパートを取得
function getCheckedParts(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`))
                .map(checkbox => checkbox.value);
}

// 新しい曲をリクエスト
async function requestSong() {
    const artistInput = document.getElementById('artistInput');
    const songInput = document.getElementById('songInput');
    const artist = artistInput.value.trim();
    const song = songInput.value.trim();
    
    const playParts = getCheckedParts('playPart');
    const recruitParts = getCheckedParts('recruitPart');
    
    if (artist && song && playParts.length > 0) {
        const newRequest = { artist, song, playParts, recruitParts };
        requests.push(newRequest);
        localStorage.setItem('songRequests', JSON.stringify(requests));
        
        try {
            const response = await fetch(GAS_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRequest)
            });
            console.log('Request sent to Google Sheets');
        } catch (error) {
            console.error('Error sending request to Google Sheets:', error);
        }

        artistInput.value = '';
        songInput.value = '';
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        displayRequests();
    } else {
        alert('アーティスト名、曲名、演奏パートは必須です。');
    }
}

// 初期表示
displayRequests();