
const app = document.getElementById('app');

const etapa = [
    {
        id: 'localizacao',
        html: `
        <div class="etapa">
            <img src="images/localizacao.png" class="etapa-img" width="150" height="150" alt="Localização"/>
            <p><strong>Para prosseguir, é necessário permitir acesso à localização.</strong></p>
            <div class="d-grid gap-2 col-6 mx-auto">
                <button class="btn btn-outline-secondary" onclick="voltar()">cancelar</button>
                <button id="geoBtn" class="btn btn-success" onclick="capturarLocalizacao()">capturar localização</button>
            </div>
        </div>`
    },
    {
        id: 'documento',
        html: `
        <div class="etapa">
            <img src="images/documento.png" class="etapa-img" width="160" height="150" alt="Documento"/>
            <p><strong>Precisamos de uma foto do seu documento com foto.<br>Certifique-se de que:</strong></p>
            <ul class="text-start d-inline-block">
                <li>Esteja fora do plástico;</li>
                <li>As informações estejam claras;</li>
                <li>A foto seja tirada em um local bem iluminado.</li>
            </ul>
            <div class="d-grid gap-2 col-6 mx-auto mt-3">
                <button class="btn btn-outline-secondary" onclick="voltar()">voltar</button>
                <button id="btnCamera" class="btn btn-success" onclick="abrirCamera()">tirar foto</button>
            </div>
        </div>`
    },
    {
        id: 'selfie',
        html: `
        <div class="etapa">
            <img src="images/selfie.png" class="etapa-img" width="150" height="180" alt="Selfie"/>
            <p><strong>Precisamos de uma foto sua!<br>Certifique-se de que:</strong></p>
            <ul class="text-start d-inline-block">
                <li>A foto seja tirada em um local bem iluminado;</li>
                <li>Seu rosto esteja centralizado;</li>
                <li>Você não esteja usando nenhum tipo de acessório (óculos, bonés etc.).</li>
            </ul>
            <div class="d-grid gap-2 col-6 mx-auto mt-3">
                <button class="btn btn-outline-secondary" onclick="voltar()">voltar</button>
                <button id="btnCamera" class="btn btn-success" onclick="abrirCamera()">tirar foto</button>
            </div>
        </div>`
    },
    {
        id: 'selfie-doc',
        html: `
        <div class="etapa">
            <img src="images/selfie-doc.png" class="etapa-img" width="150" height="160" alt="Selfie com documento"/>
            <p><strong>Precisamos de uma foto sua com o seu documento em mãos!<br>Certifique-se de que:</strong></p>
            <ul class="text-start d-inline-block">
                <li>A foto seja tirada em um local bem iluminado;</li>
                <li>Seu rosto esteja centralizado;</li>
                <li>Você não esteja usando nenhum tipo de acessório (óculos, bonés etc.).</li>
            </ul>
            <div class="d-grid gap-2 col-6 mx-auto mt-3">
                <button class="btn btn-outline-secondary" onclick="voltar()">voltar</button>
                <button id="btnCamera" class="btn btn-success" onclick="abrirCamera()">tirar foto</button>
            </div>
        </div>`
    },
    {
        id: 'sucesso',
        html: `
        <div class="etapa">
            <img src="images/sucesso.png" class="etapa-img" width="150" height="160" alt="Sucesso"/>
            <p><strong>Autenticação realizada com sucesso!</strong></p>
            <div class="d-grid gap-2 col-6 mx-auto mt-3">
                <button class="btn btn-success" onclick="reiniciar()">finalizar</button>
            </div>
        </div>`
    }
];

let etapaAtual = 0;
let localizacaoCapturada = false;
let cameraAberta = false;
let streamAtivo;

function renderizaEtapa() {
    if (streamAtivo) {
        streamAtivo.getTracks().forEach(track => track.stop());
        streamAtivo = null;
    }
    cameraAberta = false;

    app.innerHTML = etapa[etapaAtual].html;
}

function proximaEtapa() {
    if (etapaAtual < etapa.length - 1) {
        etapaAtual++;
        renderizaEtapa();
    }
}

function voltar() {
    if (etapaAtual > 0) {
        etapaAtual--;
        renderizaEtapa();
    }
}

function reiniciar() {
    etapaAtual = 0;
    renderizaEtapa();
}

function capturarLocalizacao() {
    const btn = document.getElementById("geoBtn");
    
    if (etapaAtual === 0) {
        localizacaoCapturada = false;
    }

    if (!localizacaoCapturada) {
        if (navigator.geolocation) {
            btn.disabled = true;
            btn.textContent = "capturando...";

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    alert(`Localização capturada:\n\nLatitude: ${position.coords.latitude}\nLongitude: ${position.coords.longitude}`);

                    localizacaoCapturada = true;
                    btn.textContent = "continuar";
                    btn.disabled = false;
                    btn.onclick = proximaEtapa; // agora pode avançar
                },
                (error) => {
                    alert("Erro ao obter localização: " + error.message);
                    btn.textContent = "capturar localização";
                    btn.disabled = false;
                }
            );
        } else {
            alert("Seu navegador não suporta geolocalização.");
        }
    } else {
        proximaEtapa(); // fallback
    }
}

function abrirCamera() {
    const btn = document.getElementById("btnCamera");

    if (!cameraAberta) {
        // Abre a câmera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                streamAtivo = stream;
                const video = document.createElement('video');
                video.id = "previewCamera";
                video.srcObject = stream;
                video.autoplay = true;
                video.playsInline = true;
                video.style.width = '100%';
                video.style.maxWidth = '400px';
                video.classList.add("mt-3");

                // Adiciona o vídeo na página (pode ajustar o local)
                btn.parentElement.appendChild(video);

                cameraAberta = true;
                btn.textContent = "próxima etapa";
            })
            .catch((error) => {
                alert("Erro ao acessar a câmera: " + error.message);
            });
    } else {
        // Encerra a câmera e avança
        if (streamAtivo) {
            streamAtivo.getTracks().forEach(track => track.stop());
        }

        const video = document.getElementById("previewCamera");
        if (video) video.remove();

        proximaEtapa();
    }
}

renderizaEtapa();
