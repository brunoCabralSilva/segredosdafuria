export const capitalizeFirstLetter = (str: string): String => {
  switch(str) {
    case 'global': return 'Dons Nativos';
    case 'silent striders': return 'Peregrinos Silenciosos';
    case 'black furies': return 'Fúrias Negras';
    case 'silver fangs': return 'Presas de Prata';
    case 'hart wardens': return 'Guarda do Cervo';
    case 'ghost council': return 'Conselho Fantasma';
    case 'galestalkers': return 'Perseguidores da Tempestade';
    case 'glass walkers': return 'Andarilhos do Asfalto';
    case 'bone gnawers': return 'Roedores de Ossos';
    case 'shadow lords': return 'Senhores das Sombras';
    case 'children of gaia': return 'Filhos de Gaia';
    case 'red talons': return 'Garras Vermelhas';
    default: return str.charAt(0).toUpperCase() + str.slice(1);;
  }
};