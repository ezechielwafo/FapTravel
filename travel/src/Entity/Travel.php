<?php

namespace App\Entity;

use App\Repository\TravelRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert; 

#[ORM\Entity(repositoryClass: TravelRepository::class)]
class Travel
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['travel:read', 'travel:write'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['travel:read', 'travel:write'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['travel:read', 'travel:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['travel:read', 'travel:write'])]
    #[Assert\Type(\DateTimeInterface::class)]
    private ?\DateTime $startDate = null;

    #[ORM\Column]
    #[Groups(['travel:read', 'travel:write'])]
    #[Assert\Type(\DateTimeInterface::class)] // <-- Exemple de contrainte
    #[Assert\GreaterThanOrEqual(propertyPath: 'startDate', message: 'The end date must be greater than or equal to the start date.')]
    private ?\DateTime $endDate = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['travel:read', 'travel:write'])]
    private ?string $price = null;

    #[ORM\Column]
    #[Groups(['travel:read', 'travel:write'])]
    #[Assert\PositiveOrZero]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getStartDate(): ?\DateTime
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTime $startDate): static
    {
        $this->startDate = $startDate;

        return $this;
    }

    public function getEndDate(): ?\DateTime
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTime $endDate): static
    {
        $this->endDate = $endDate;

        return $this;
    }

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(?string $price): static
    {
        $this->price = $price;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
