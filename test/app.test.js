const request = require('supertest');
const app = require('./app'); // Annahme: Die Express-App ist in einer Datei namens "app.js" gespeichert

describe('Login endpoint', () => {
  it('should log in a user with correct credentials', async () => {
    // Mock-Daten für einen vorhandenen Benutzer
    const mockUser = {
      username: 'testuser',
      password: 'testpassword'
    };

    // Anfrage an den Anmelderoute senden
    const res = await request(app)
      .post('/login')
      .send(mockUser);

    // Überprüfen, ob die Antwort eine Umleitung auf "/" zurückgibt
    expect(res.statusCode).toEqual(302); // Statuscode 302 entspricht einer Umleitung
    expect(res.header.location).toEqual('/'); // Überprüfen, ob der Benutzer auf die Startseite umgeleitet wird
  });
});
