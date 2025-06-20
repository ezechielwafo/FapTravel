<?php

namespace App\Form;

use App\Entity\Travel;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
// Importe les types de champs nécessaires
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateType; // Ou DateTimeType si tu veux l'heure
use Symfony\Component\Form\Extension\Core\Type\NumberType; // Pour le prix
use Symfony\Component\Form\Extension\Core\Type\SubmitType; // Pour le bouton d'envoi

class TravelType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom du voyage',
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'required' => false, // La description est nullable dans l'entité
            ])
            ->add('startDate', DateType::class, [ // Utilise DateType pour juste la date
                'label' => 'Date de début',
                'widget' => 'single_text', // Affiche un champ texte pour la date
            ])
            ->add('endDate', DateType::class, [ // Utilise DateType pour juste la date
                'label' => 'Date de fin',
                'widget' => 'single_text', // Affiche un champ texte pour la date
            ])
            ->add('price', NumberType::class, [ // Utilise NumberType pour le prix
                'label' => 'Prix',
                'required' => false, // Le prix est nullable dans l'entité
                'scale' => 2, // Pour permettre les décimales (centimes)
            ])
            // Optionnel : Ajouter un bouton d'envoi
            // ->add('save', SubmitType::class, [
            //     'label' => 'Créer le voyage',
            // ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Travel::class,
        ]);
    }
}