<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Entity\User;
use App\Repository\FavoriteRepository;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class FavoriteController extends AbstractController
{
    private $favoriteRepository;
    private $userRepository;

    public function __construct(FavoriteRepository $favoriteRepository, UserRepository $userRepository)
    {
        $this->favoriteRepository = $favoriteRepository;
        $this->userRepository = $userRepository;
    }

    /**
     * @Route("api/favorite/add", name="add_favorite", methods={"POST"})
     */
    public function addFavorite(Request $request): JsonResponse
    {
        $userId = $this->getUser()->getId(); // Assuming the user is logged in
        $locationId = $request->get('locationId');

        // Check if favorite already exists for this user
        $existingFavorite = $this->favoriteRepository->findOneBy(['user' => $userId, 'locationId' => $locationId]);
        
        if ($existingFavorite) {
            return new JsonResponse(['message' => 'Location already favorited.'], Response::HTTP_BAD_REQUEST);
        }

        // Create a new favorite
        $favorite = new Favorite();
        $favorite->setUser($this->userRepository->find($userId));
        $favorite->setLocationId($locationId);
        $this->getDoctrine()->getManager()->persist($favorite);
        $this->getDoctrine()->getManager()->flush();

        return new JsonResponse(['message' => 'Location added to favorites.'], Response::HTTP_OK);
    }

    /**
     * @Route("/api/favorite/remove", name="remove_favorite", methods={"DELETE"})
     */
    public function removeFavorite(Request $request): JsonResponse
    {
        $userId = $this->getUser()->getId(); // Assuming the user is logged in
        $locationId = $request->get('locationId');

        $favorite = $this->favoriteRepository->findOneBy(['user' => $userId, 'locationId' => $locationId]);

        if (!$favorite) {
            return new JsonResponse(['message' => 'Favorite not found.'], Response::HTTP_NOT_FOUND);
        }

        $this->getDoctrine()->getManager()->remove($favorite);
        $this->getDoctrine()->getManager()->flush();

        return new JsonResponse(['message' => 'Location removed from favorites.'], Response::HTTP_OK);
    }

    /**
     * @Route("/api/favorite/list", name="list_favorites", methods={"GET"})
     */
    public function listFavorites(): JsonResponse
    {
        $userId = $this->getUser()->getId(); // Assuming the user is logged in

        $favorites = $this->favoriteRepository->findBy(['user' => $userId]);
        $locations = [];

        foreach ($favorites as $favorite) {
            $locations[] = $favorite->getLocationId();
        }

        return new JsonResponse($locations, Response::HTTP_OK);
    }
}