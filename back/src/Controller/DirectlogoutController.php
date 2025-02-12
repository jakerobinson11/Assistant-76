<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DirectlogoutController extends AbstractController
{
    /**
     * @Route("/directlogout", name="app_directlogout")
     */
    public function index(): Response
    {
        return $this->redirectToRoute('app_logout');
    }
}
