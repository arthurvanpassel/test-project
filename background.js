let names = {
  "animals": ["arend","baars","beer","bever","bij","bizon","buffel","cavia","cobra","dodo","dolfijn","duif","eend","egel","ekster","eland","ever","ezel","fazant","forel","fret","gans","geit","gems","gier","gier","giraf","gnoe","gorilla","haai","haan","haas","hamster","haring","havik","hert","hoen","hond","ibis","kalf","karper","kat","kauw","kever","kikker","kip","kiwi","kiwi","koala","koe","konijn","kraai","krab","kreeft","kwal","lama","leeuw","mees","meeuw","mol","mot","mug","muis","mus","nerts","okapi","olifant","orka","otter","paard","pad","panda","panter","parkiet","pauw","pirana","poema","poes","pony","raaf","rog","schaap","schelp","slak","slang","snoek","spin","stier","tijger","tong","tonijn","uil","valk","varken","vis","vlieg","vlo","vogel","wesp","wolf","worm","zalm","zebra","zeester","zwaan"],
  "colors": ["aqua","azuur","beige","beige","blauw","brons","bruin","citroen","geel","goud","grijs","groen","indigo","ivoor","kaki","karmijn","kastanje","koper","koraal","lavendel","marine","munt","oker","olijf","oranje","paars","purper","rood","roze","schelp","tomaat","violet","wit","zand","zilver","zwart"]
}
var randomAnimalKey = Math.floor(Math.random() * (names.animals.length))
var randomAnimal = names.animals[randomAnimalKey]
var randomColorKey = Math.floor(Math.random() * (names.colors.length))
var randomColor = names.colors[randomColorKey]
let username = randomAnimal + "-" + randomColor;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ username });
  console.log('Random username set to', `username: ${username}`);
});