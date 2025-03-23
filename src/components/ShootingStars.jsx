// src/components/ShootingStars.jsx
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const ShootingStars = () => {
  const { theme } = useTheme();
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create stars data
    const stars = [];
    const shootingStars = [];
    const starCount = Math.floor(window.innerWidth * window.innerHeight / 10000);
    
    // Initialize regular stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * 0.03 + 0.01
      });
    }
    
    // Shooting star creation function
    const createShootingStar = () => {
      const shootingStar = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height / 2,
        length: Math.random() * 80 + 150,
        speed: Math.random() * 10 + 15,
        angle: Math.random() * Math.PI / 4 + Math.PI / 4,
        opacity: 0,
        fadeInSpeed: 0.03,
        fadeOutSpeed: 0.01,
        life: 0,
        maxLife: Math.random() * 100 + 80
      };
      
      shootingStars.push(shootingStar);
      
      // Limit number of shooting stars
      if (shootingStars.length > 3) {
        shootingStars.shift();
      }
    };
    
    // Animation loop
    let animationFrameId;
    let frameCount = 0;
    
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw regular stars
      stars.forEach((star, i) => {
        // Pulsate stars
        star.opacity += star.pulse;
        if (star.opacity > 0.8 || star.opacity < 0.3) {
          star.pulse = -star.pulse;
        }
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = theme === 'dark' 
          ? `rgba(255, 255, 255, ${star.opacity})` 
          : `rgba(100, 149, 237, ${star.opacity * 0.7})`;
        ctx.fill();
      });
      
      // Create shooting star occasionally
      if (frameCount % 120 === 0 && Math.random() > 0.5) {
        createShootingStar();
      }
      
      // Draw shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const shootingStar = shootingStars[i];
        
        // Update shooting star life
        shootingStar.life++;
        
        // Fade in/out
        if (shootingStar.life < 30) {
          shootingStar.opacity += shootingStar.fadeInSpeed;
        } else if (shootingStar.life > shootingStar.maxLife - 30) {
          shootingStar.opacity -= shootingStar.fadeOutSpeed;
        }
        
        // Remove dead shooting stars
        if (shootingStar.life >= shootingStar.maxLife) {
          shootingStars.splice(i, 1);
          continue;
        }
        
        // Calculate shooting star trail start and end points
        const trailStartX = shootingStar.x;
        const trailStartY = shootingStar.y;
        const trailEndX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const trailEndY = shootingStar.y + Math.sin(shootingStar.angle) * shootingStar.length;
        
        // Move shooting star
        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y -= Math.sin(shootingStar.angle) * shootingStar.speed;
        
        // Create gradient for trail
        const gradient = ctx.createLinearGradient(trailStartX, trailStartY, trailEndX, trailEndY);
        
        const startColor = theme === 'dark' 
          ? `rgba(255, 255, 255, ${shootingStar.opacity})` 
          : `rgba(100, 149, 237, ${shootingStar.opacity})`;
          
        const endColor = theme === 'dark' 
          ? 'rgba(255, 255, 255, 0)' 
          : 'rgba(100, 149, 237, 0)';
          
        gradient.addColorStop(0, startColor);
        gradient.addColorStop(1, endColor);
        
        // Draw shooting star trail
        ctx.beginPath();
        ctx.moveTo(trailStartX, trailStartY);
        ctx.lineTo(trailEndX, trailEndY);
        ctx.lineWidth = theme === 'dark' ? 2 : 3;
        ctx.strokeStyle = gradient;
        ctx.stroke();
      }
      
      frameCount++;
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: theme === 'dark' ? 1 : 0.6 }}
    />
  );
};

export default ShootingStars;