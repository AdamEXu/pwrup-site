import { useEffect } from 'react';
import Lenis from 'lenis';

export function useLenis() {
	useEffect(() => {
		// Initialize Lenis with your configuration
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Light easing
			infinite: false,
		});

		// Make Lenis globally accessible for debugging
		(window as any).lenis = lenis;

		// Animation frame loop
		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		// Log that Lenis is initialized
		console.log('Lenis smooth scroll initialized with config:', {
			duration: 1.2,
			easing: 'custom light easing',
			infinite: false
		});

		// Cleanup function
		return () => {
			lenis.destroy();
		};
	}, []);
}
