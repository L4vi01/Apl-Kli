const obrazy = ['assets/images/puzzle1.jpg', 'assets/images/puzzle2.jpg', 'assets/images/puzzle3.jpg'];
let aktualnyIndeksObrazu = 0;
let interwalCzasomierza;
let czasStartu;
let uplynietyCzas = 0;
let aktualnaGra;

class GraPrzesuwanka {
    constructor(idKontenera, sciezkaObrazu, rozmiar = 3) {
        this.kontener = document.getElementById(idKontenera);
        this.sciezkaObrazu = sciezkaObrazu;
        this.rozmiar = rozmiar;
        this.kafelki = [];
        this.pustyKafelek = { wiersz: rozmiar - 1, kolumna: rozmiar - 1 };
        this.inicjalizuj();
    }

    inicjalizuj() {
        this.kontener.innerHTML = '';
        this.kontener.style.setProperty('--rozmiar', this.rozmiar);
        this.kontener.style.gridTemplateColumns = `repeat(${this.rozmiar}, 1fr)`;
        this.kontener.style.gridTemplateRows = `repeat(${this.rozmiar}, 1fr)`;
        this.utworzKafelki();
    }

    utworzKafelki() {
        let indeks = 0;
        for (let wiersz = 0; wiersz < this.rozmiar; wiersz++) {
            for (let kolumna = 0; kolumna < this.rozmiar; kolumna++) {
                if (wiersz === this.pustyKafelek.wiersz && kolumna === this.pustyKafelek.kolumna) continue;

                const kafelek = document.createElement('div');
                kafelek.classList.add('kafelek');
                kafelek.style.backgroundImage = `url(${this.sciezkaObrazu})`;
                kafelek.style.backgroundSize = `${this.rozmiar * 100}% ${this.rozmiar * 100}%`;
                kafelek.style.backgroundPosition = `${-kolumna * 100 / (this.rozmiar - 1)}% ${-wiersz * 100 / (this.rozmiar - 1)}%`;
                kafelek.dataset.wiersz = wiersz;
                kafelek.dataset.kolumna = kolumna;
                kafelek.dataset.poprawnyIndeks = indeks++;

                kafelek.addEventListener('click', () => this.przesunKafelek(parseInt(kafelek.dataset.wiersz), parseInt(kafelek.dataset.kolumna)));

                this.kontener.appendChild(kafelek);
                this.kafelki.push({ element: kafelek, wiersz: wiersz, kolumna: kolumna });
            }
        }
    }

    async mieszajKafelki() {
        const liczbaRuchow = this.rozmiar * this.rozmiar * 10;

        for (let i = 0; i < liczbaRuchow; i++) {
            const sasiednieKafelki = this.pobierzRuchomeKafelki();
            const losowyKafelek = sasiednieKafelki[Math.floor(Math.random() * sasiednieKafelki.length)];
            this.przesunKafelek(losowyKafelek.wiersz, losowyKafelek.kolumna, false);
            await new Promise(resolve => setTimeout(resolve, 20));
        }
        this.rozpocznijCzasomierz();
    }

    pobierzRuchomeKafelki() {
        return this.kafelki.filter(kafelek => {
            return (Math.abs(kafelek.wiersz - this.pustyKafelek.wiersz) === 1 && kafelek.kolumna === this.pustyKafelek.kolumna) ||
                (Math.abs(kafelek.kolumna - this.pustyKafelek.kolumna) === 1 && kafelek.wiersz === this.pustyKafelek.wiersz);
        });
    }

    przesunKafelek(wiersz, kolumna, sprawdzajWygrana = true) {
        if (!this.czyMozliwyRuch(wiersz, kolumna)) return;

        const kafelek = this.kafelki.find(k => k.wiersz === wiersz && k.kolumna === kolumna);
        if (!kafelek) return;

        [kafelek.wiersz, this.pustyKafelek.wiersz] = [this.pustyKafelek.wiersz, kafelek.wiersz];
        [kafelek.kolumna, this.pustyKafelek.kolumna] = [this.pustyKafelek.kolumna, kafelek.kolumna];

        kafelek.element.style.left = `${kafelek.kolumna * 100 / this.rozmiar}%`;
        kafelek.element.style.top = `${kafelek.wiersz * 100 / this.rozmiar}%`;
        kafelek.element.dataset.wiersz = kafelek.wiersz;
        kafelek.element.dataset.kolumna = kafelek.kolumna;

        if (sprawdzajWygrana) this.sprawdzWygrana();
    }

    czyMozliwyRuch(wiersz, kolumna) {
        return (Math.abs(wiersz - this.pustyKafelek.wiersz) === 1 && kolumna === this.pustyKafelek.kolumna) ||
            (Math.abs(kolumna - this.pustyKafelek.kolumna) === 1 && wiersz === this.pustyKafelek.wiersz);
    }

    sprawdzWygrana() {
        const czyPoprawnie = this.kafelki.every(kafelek => kafelek.wiersz * this.rozmiar + kafelek.kolumna == kafelek.element.dataset.poprawnyIndeks);
        if (czyPoprawnie) {
            this.zatrzymajCzasomierz();
            document.getElementById('czas-wygranej').textContent = formatujCzas(uplynietyCzas);
            document.getElementById('overlay-wygrana').style.display = 'flex';
        }
    }

    rozpocznijCzasomierz() {
        czasStartu = Date.now() - uplynietyCzas;
        interwalCzasomierza = setInterval(() => {
            uplynietyCzas = Date.now() - czasStartu;
            aktualizujCzasomierz();
        }, 10);
    }

    zatrzymajCzasomierz() {
        clearInterval(interwalCzasomierza);
    }
}

function formatujCzas(czas) {
    const milisekundy = parseInt((czas % 1000) / 10);
    const sekundy = parseInt((czas / 1000) % 60);
    const minuty = parseInt((czas / (1000 * 60)) % 60);
    const godziny = parseInt((czas / (1000 * 60 * 60)) % 24);

    return `${godziny.toString().padStart(2, '0')}:${minuty.toString().padStart(2, '0')}:${sekundy.toString().padStart(2, '0')}.${milisekundy.toString().padStart(2, '0')}`;
}

function aktualizujCzasomierz() {
    const sformatowanyCzas = formatujCzas(uplynietyCzas);
    const elementCzasomierza = document.getElementById('czasomierz');
    elementCzasomierza.innerHTML = '';

    for (const znak of sformatowanyCzas) {
        const img = document.createElement('img');
        img.src = znak === ':' ? 'assets/cyferki/colon.gif' : znak === '.' ? 'assets/cyferki/dot.gif' : `assets/cyferki/c${znak}.gif`;
        elementCzasomierza.appendChild(img);
    }
}

function rozpocznijGre(rozmiar, pomieszaj = false) {
    if (aktualnaGra) aktualnaGra.zatrzymajCzasomierz();
    aktualnaGra = new GraPrzesuwanka('plansza-gry', obrazy[aktualnyIndeksObrazu], rozmiar);

    if (!pomieszaj) {
        aktualnaGra.mieszajKafelki();
    } else {
        aktualnaGra.rozpocznijCzasomierz();
    }
}

function poprzedniObraz() {
    aktualnyIndeksObrazu = (aktualnyIndeksObrazu - 1 + obrazy.length) % obrazy.length;
    document.getElementById('podglad').src = obrazy[aktualnyIndeksObrazu];
}

function nastepnyObraz() {
    aktualnyIndeksObrazu = (aktualnyIndeksObrazu + 1) % obrazy.length;
    document.getElementById('podglad').src = obrazy[aktualnyIndeksObrazu];
}

function zamknijOverlay() {
    document.getElementById('overlay-wygrana').style.display = 'none';
}

function zapiszStanGry() {
    if (!aktualnaGra) return;

    const stanGry = {
        kafelki: aktualnaGra.kafelki.map(kafelek => ({
            wiersz: kafelek.wiersz,
            kolumna: kafelek.kolumna,
            poprawnyIndeks: kafelek.element.dataset.poprawnyIndeks
        })),
        uplynietyCzas: uplynietyCzas,
        sciezkaObrazu: obrazy[aktualnyIndeksObrazu],
        rozmiar: aktualnaGra.rozmiar
    };

    const zapisaneStany = JSON.parse(localStorage.getItem('zapisaneStany') || '[]');
    zapisaneStany.unshift(stanGry);
    if (zapisaneStany.length > 3) zapisaneStany.pop();
    localStorage.setItem('zapisaneStany', JSON.stringify(zapisaneStany));
    aktualizujListeZapisanychStanow();
}

function aktualizujListeZapisanychStanow() {
    const zapisaneStany = JSON.parse(localStorage.getItem('zapisaneStany') || '[]');
    const lista = document.getElementById('lista-zapisanych-stanow');
    lista.innerHTML = '';

    zapisaneStany.forEach((stan, indeks) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <img src="${stan.sciezkaObrazu}" alt="Miniatura" width="50">
            <span>Czas: ${formatujCzas(stan.uplynietyCzas)}</span>
            <button onclick="wczytajStanGry(${indeks})">Wczytaj</button>
        `;
        lista.appendChild(li);
    });
}

function wczytajStanGry(indeks) {
    const zapisaneStany = JSON.parse(localStorage.getItem('zapisaneStany') || '[]');
    if (!zapisaneStany[indeks]) return;

    const stan = zapisaneStany[indeks];
    if (!confirm(`Wczytać grę z czasem ${formatujCzas(stan.uplynietyCzas)}?`)) return;

    aktualnyIndeksObrazu = obrazy.indexOf(stan.sciezkaObrazu);
    document.getElementById('podglad').src = stan.sciezkaObrazu;

    rozpocznijGre(stan.rozmiar, true);

    stan.kafelki.forEach(stanKafelka => {
        const kafelek = aktualnaGra.kafelki.find(k => k.element.dataset.poprawnyIndeks == stanKafelka.poprawnyIndeks);
        if (kafelek) {
            kafelek.wiersz = stanKafelka.wiersz;
            kafelek.kolumna = stanKafelka.kolumna;
            kafelek.element.style.left = `${kafelek.kolumna * 100 / aktualnaGra.rozmiar}%`;
            kafelek.element.style.top = `${kafelek.wiersz * 100 / aktualnaGra.rozmiar}%`;
            kafelek.element.addEventListener('click', () => aktualnaGra.przesunKafelek(parseInt(kafelek.dataset.wiersz), parseInt(kafelek.dataset.kolumna)));
        }
    });

    uplynietyCzas = stan.uplynietyCzas;
    aktualizujCzasomierz();
}

document.addEventListener('DOMContentLoaded', aktualizujListeZapisanychStanow);