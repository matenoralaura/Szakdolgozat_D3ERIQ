A felület lokális megtekintéséhez a következők a teendők a repository kódszerkesztőbe való betöltése után:

4 külön terminálban kell futtatni az alábbi parancsokat egymás után:

1. terminál:
cd .\action_server\n
rasa run actions

2. terminál:
cd .\rasa_server\n
rasa run -m /app/models --enable-api --cors * --debug

3. terminál:
cd .\nodejs\n
npm start

4. terminál:
ssh [h-s azonosító]@linux.inf.u-szeged.hu -NfL :25565:rgai3.inf.u-szeged.hu:25565\n
Ezután a h-s azonosítóhoz tartozó jelszót kell megadni.
