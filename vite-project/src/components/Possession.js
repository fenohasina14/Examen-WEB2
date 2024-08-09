export default class Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    this.possesseur = possesseur;
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.tauxAmortissement = tauxAmortissement;
  }

  getValeur(dateActuelle) {
    return this.getValeurApresAmortissement(dateActuelle);
  }

  getValeurApresAmortissement(dateActuelle) {
    if (dateActuelle < this.dateDebut) {
      return this.valeur; // La valeur ne devrait pas être 0 si la date actuelle est avant la date de début
    }

    // Calcul de la durée en années
    const diffInYears = (dateActuelle - this.dateDebut) / (1000 * 60 * 60 * 24 * 365);

    // Calcul de la valeur après amortissement
    const valeurAmortie = this.valeur - (diffInYears * this.tauxAmortissement);

    return Math.max(valeurAmortie, 0); // Assurer que la valeur n'est pas négative
  }
}
