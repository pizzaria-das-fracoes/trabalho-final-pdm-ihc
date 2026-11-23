# Licenças dos Áudios Bundled — FatiaMática

Todos os áudios incluídos em `assets/audio/` foram pré-gerados e convertidos para MP3 offline, sem dependência de API externa em tempo de execução e sem inclusão de binários GPL no pacote Android/iOS.

## 1. Efeitos Sonoros e Fanfarra de Vitória (`assets/audio/sfx/`)
- **Interface Sounds (Kenney)** — https://kenney.nl/assets/interface-sounds
  - Arquivos convertidos: `tap.mp3` (`click_001.ogg`), `slice.mp3` (`pluck_002.ogg`), `coin.mp3` (`confirmation_001.ogg`), `success.mp3` (`confirmation_002.ogg`), `oops.mp3` (`error_007.ogg`)
  - Licença verificada no `License.txt` do pacote: **CC0 1.0 Universal (Public Domain Dedication)** — uso comercial permitido sem restrições; atribuição opcional.
- **Music Jingles (Kenney)** — https://kenney.nl/assets/music-jingles
  - Arquivo convertido: `victory.mp3` (`Pizzicato jingles/jingles_PIZZI07.ogg`)
  - Licença verificada no `License.txt` do pacote: **CC0 1.0 Universal (Public Domain Dedication)** — uso comercial permitido sem restrições; atribuição opcional.

## 2. Voz do Professor Fatia (`assets/audio/voice/`)
- **Gerador offline**: Piper TTS (`https://github.com/rhasspy/piper` / `OHF-Voice/piper1-gpl` v1.8.0) utilizado exclusivamente em build/desenvolvimento para pré-renderizar os arquivos `.mp3` estáticos (nenhuma biblioteca `espeak-ng` ou código GPL é empacotada no app).
- **Modelo utilizado**: `pt_BR-faber-medium` (`https://huggingface.co/rhasspy/piper-voices/tree/main/pt/pt_BR/faber/medium`)
  - Dataset (`OHF-Voice/voice-datasets`): **CC0 1.0 Universal**
  - Modelo base (`en_US/hifi_tts_92` — Hi-Fi Multi-Speaker English TTS Dataset, NVIDIA Corporation / leitora Cori Samuel): **CC BY 4.0** (`https://www.openslr.org/109/`). Uso comercial permitido na Google Play Store mediante atribuição (incluída também na tela *Sobre o FatiaMática* do app).
- **Nota comparativa**: `pt_BR-cadu-medium` (CC0) e `pt_BR-jeff-medium` (CC0) foram testados, porém apresentaram timbre mais nasal/áspero em testes auditivos; `pt_BR-faber-medium` com parâmetros nativos (`noise_scale=0.45`, `noise_w=0.333`, `length_scale=0.97`) e masterização limpa a `44.1 kHz` apresentou dicção e naturalidade muito superiores para o público infantil.
