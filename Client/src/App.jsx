import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import SplashCursor from './components/layout/SplashCursor';
import ScrollToTop from './components/layout/ScrollToTop';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Resume = lazy(() => import('./pages/Resume'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
    </div>
);

function App() {
    return (
        <Router>
            <ScrollToTop />
            <SplashCursor />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="projects" element={<Projects />} />
                        <Route path="projects/:id" element={<ProjectDetail />} />
                        <Route path="resume" element={<Resume />} />
                        <Route path="contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
