<?php
// src/Security/JwtAuthenticator.php

namespace App\Security;

// REMOVE this line:
// use Lexik\Bundle\JWTAuthenticationBundle\Manager\JWTManagerInterface;
//use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Core\User\UserProviderInterface;

class JwtAuthenticator extends AbstractAuthenticator
{
    private $jwtManager;
    private $userProvider;

    public function __construct(
        JWTTokenManagerInterface $jwtManager,
        UserProviderInterface $userProvider
    ) {
        $this->jwtManager = $jwtManager;
        $this->userProvider = $userProvider;
    }

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization') && str_starts_with($request->headers->get('Authorization'), 'Bearer ');
    }

    public function authenticate(Request $request): Passport
    {
        $token = $request->headers->get('Authorization');
        $token = substr($token, 7);

        if (!$token) {
            throw new BadCredentialsException('Token not found');
        }

        try {
            $payload = $this->jwtManager->decode($token);
            $username = $payload['username'] ?? $payload['email'] ?? null;

            if (!$username) {
                throw new BadCredentialsException('Invalid token payload');
            }

            $user = $this->userProvider->loadUserByIdentifier($username);

            return new SelfValidatingPassport(new UserBadge($username, function() use ($user) {
                return $user;
            }));

        } catch (\Lexik\Bundle\JWTAuthenticationBundle\Exception\JWTDecodeFailureException $e) {
            throw new BadCredentialsException('Invalid JWT: ' . $e->getMessage());
        } catch (\Exception $e) {
            throw new BadCredentialsException('Authentication error: ' . $e->getMessage());
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData()),
        ];
        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }
}