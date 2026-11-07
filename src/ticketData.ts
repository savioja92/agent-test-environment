import type { Ticket } from './types';

export const ticketData: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Sähköposti kirjautuminen ei toimi.',
    description: 'Käyttäjä ei pääse kirjautumaan Outlook-sähköpostiin salasanan vaihdon jälkeen. Virheilmoitus valittaa vanhentuneesta istunnosta.',
    status: 'open',
  },
  {
    id: 'ticket-2',
    title: 'Tuplaleloitus lokakuun palvelumaksussa',
    description: 'Asiakkaan luottokortilta on veloitettu lokakuun kuukausimaksu kahteen kertaan. Pyytää hyvitystä toisesta veloituksesta.',
    status: 'open',
  },
  {
    id: 'ticket-3',
    title: 'VPN-yhteys katkeilee etätyössä',
    description: 'Cisco AnyConnect katkaisee yhteyden 15 minuutin välein. Käyttäjä ei pysty käyttämään sisäverkon tiedostopalvelinta.',
    status: 'open',
  },
  {
    id: 'ticket-4',
    title: 'Virheellinen Y-tunnus verkkolaskulla',
    description: 'Laskulla 2026-0891 näkyy vanha Y-tunnus. Asiakas pyytää päivittämään laskutustiedot ja lähettämään korjatun laskun.',
    status: 'open',
  },
  {
    id: 'ticket-5',
    title: 'Uuden työntekijän käyttöoikeudet puuttuvat',
    description: 'Maanantaina aloittaneelta tiimiläiseltä puuttuu pääsy Jiraan ja Slackin projektikanaville.',
    status: 'open',
  },
  {
    id: 'ticket-6',
    title: 'Kaksivaiheinen tunnistautuminen (MFA) lukossa',
    description: 'Puhelin vaihtui eikä Microsoft Authenticator -sovellusta ole siirretty. Käyttäjä tarvitsee MFA-nollauksen.',
    status: 'open',
  },
  {
    id: 'ticket-7',
    title: 'Maksumuistutus jo maksetusta laskusta',
    description: 'Asiakas sai maksumuistutuksen laskusta, joka on maksettu eräpäivänä viikko sitten. Maksukuitti on liitteenä.',
    status: 'open',
  },
  {
    id: 'ticket-8',
    title: 'Tulostin ei näy verkkolaitteissa (3. krs)',
    description: 'Kolmannen kerroksen monitoimitulostin ei vastaa tulostuspyyntöihin eikä näy Windowsin laitelistauksessa.',
    status: 'open',
  },
  {
    id: 'ticket-9',
    title: 'Vuositilauksen vaihto kuukausilaskutukseen',
    description: 'Yritysasiakas haluaa muuttaa nykyisen vuosilaskutussopimuksen kuukausittaiseksi eräksi seuraavasta kaudesta alkaen.',
    status: 'open',
  },
  {
    id: 'ticket-10',
    title: 'Näyttö vilkkuu telakkaan kytkettäessä',
    description: 'Ulkoinen Dell-näyttö sammuu ja käynnistyy uudelleen muutaman sekunnin välein USB-C-telakan kautta.',
    status: 'open',
  },
  {
    id: 'ticket-11',
    title: 'Hyvityslaskun viitenumero puuttuu',
    description: 'Taloushallinto tiedustelee, mihin alkuperäiseen laskuun eilinen hyvityslasku kohdistuu.',
    status: 'open',
  },
  {
    id: 'ticket-12',
    title: 'Teams-mikrofoni ei toimi kokouksissa',
    description: 'Kuulokkeet toimivat normaalisti selaimessa, mutta Teams ei tunnista mikrofonia äänilaitteeksi.',
    status: 'open',
  },
  {
    id: 'ticket-13',
    title: 'E-laskun valtuutus epäonnistui pankissa',
    description: 'Asiakas yritti kytkeä e-laskun verkkopankissa, mutta laskuttajan tunniste antaa virheilmoituksen.',
    status: 'open',
  },
  {
    id: 'ticket-14',
    title: 'Jaettu postilaatikko ei päivity',
    description: 'Asiakaspalvelun yhteinen postilaatikko näyttää viimeksi eilen saapuneet viestit työpöytäsovelluksessa.',
    status: 'open',
  },
  {
    id: 'ticket-15',
    title: 'Lisenssimäärän vähentäminen seuraavalle laskulle',
    description: 'Asiakas irtisanoo 5 käyttäjälisenssiä ja pyytää tarkistamaan tulevan laskutuskauden loppusumman.',
    status: 'open',
  },
  {
    id: 'ticket-16',
    title: 'Kannettavan tietokoneen BitLocker-palautusavain',
    description: 'Kone pyytää käynnistyksen yhteydessä BitLocker-avainta Windows-päivityksen jälkeen.',
    status: 'open',
  },
  {
    id: 'ticket-17',
    title: 'Viivästyskorko laskutettu virheellisesti',
    description: 'Uudella laskulla on peritty viivästyskorkoa, vaikka edelliselle laskulle oli sovittu maksuaikaa.',
    status: 'open',
  },
  {
    id: 'ticket-18',
    title: 'Adobe Creative Cloud -lisenssi vanhentunut',
    description: 'Markkinointitiimin suunnittelija saa ilmoituksen päättyneestä kokeilujaksosta, vaikka yrityslisenssi on voimassa.',
    status: 'open',
  },
  {
    id: 'ticket-19',
    title: 'Verkkolaskuosoitteen muutospyyntö',
    description: 'Asiakas on vaihtanut verkkolaskuoperaattoria (Maventa -> Basware) ja ilmoittaa uuden OVT-tunnuksen.',
    status: 'open',
  },
  {
    id: 'ticket-20',
    title: 'Salasanan palautuslinkki ei saavu perille',
    description: 'Asiakasportaalin salasanan nollausviesti ei tule perille eikä löydy roskapostikansiosta.',
    status: 'open',
  },
];