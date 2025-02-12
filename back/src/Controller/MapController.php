<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MapController extends AbstractController
{
    /**
     * @Route("/map", name="app_map")
     */
    public function index(): Response
    {
        header("Location: http://localhost:4200/");
        /* return $this->render('map/index.html.twig', [
            'controller_name' => 'MapController',
        ]); */
    }
}
