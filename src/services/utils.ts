//Funciones
function capitalize(txt: string):string {
  return txt
    .split(" ")
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}
export {capitalize}
