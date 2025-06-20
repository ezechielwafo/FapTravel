<?php

namespace App\Form;

use App\Entity\Guide;
use App\Entity\Visit;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class VisitForm extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('photo')
            ->add('country')
            ->add('location')
            ->add('visitDate')
            ->add('startTime')
            ->add('duration')
            ->add('endTime')
            ->add('comment')
            ->add('createdAt', null, [
                'widget' => 'single_text',
            ])
            ->add('isCompleted')
            ->add('guide', EntityType::class, [
                'class' => Guide::class,
                'choice_label' => 'id',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Visit::class,
        ]);
    }
}
