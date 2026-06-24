import { useState, useEffect, useRef } from 'react';
import { apiService } from '../utils/api';
import { FaDownload, FaFilePdf, FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Resume = () => {
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const scrollContainerRef = useRef(null);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const handleScroll = (e) => {
        if (!numPages) return;
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        // Calculate which page is mostly in view
        const pageHeight = scrollHeight / numPages;
        const current = Math.floor((scrollTop + clientHeight / 2) / pageHeight) + 1;
        const newPage = Math.min(Math.max(current, 1), numPages);
        if (newPage !== pageNumber) {
            setPageNumber(newPage);
        }
    };

    const scrollToPage = (newPage) => {
        if (!scrollContainerRef.current || !numPages) return;
        const { scrollHeight } = scrollContainerRef.current;
        const pageHeight = scrollHeight / numPages;
        scrollContainerRef.current.scrollTo({
            top: (newPage - 1) * pageHeight,
            behavior: 'smooth'
        });
        setPageNumber(newPage);
    };

    const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const res = await apiService.getResume();
                const resumeData = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                if (resumeData.length > 0) {
                    setResume(resumeData[0]); // Get the latest active resume
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load resume');
                setLoading(false);
            }
        };

        fetchResume();
    }, []);

    return (
        <div className="w-full bg-slate-50 pt-10 pb-10 relative overflow-hidden">
            {/* Soft background glow */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-4 lg:gap-12 items-center">

                    {/* Left Sidebar Info */}
                    <div className="lg:w-1/3 w-full flex flex-col justify-center items-center lg:items-start text-center lg:text-left">
                        <div>
                            <div className="inline-flex items-center gap-3 mb-3 md:mb-5 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
                                <span className="w-2 h-2 rounded-full animate-pulse bg-indigo-500"></span>
                                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-slate-800 font-bold">
                                    Interactive Resume
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-black leading-[1.1] tracking-tight font-serif mb-3 md:mb-4">
                                My <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Curriculum Vitae</span>
                            </h2>
                            <p className="text-slate-800 max-w-2xl mx-auto font-medium text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                                A comprehensive overview of my professional experience, technical skills, and educational background. Feel free to download a copy for your records.
                            </p>
                        </div>

                        {loading && (
                            <div className="p-6 rounded-3xl w-full lg:block hidden bg-white border border-slate-200 shadow-sm relative overflow-hidden group mt-auto mb-8 lg:mb-0 animate-pulse">
                                <div className="flex items-center gap-5 mb-8">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-300 shrink-0"></div>
                                    <div className="space-y-2 w-full">
                                        <div className="h-5 w-3/4 bg-slate-200 rounded-md"></div>
                                        <div className="h-3 w-1/2 bg-slate-200 rounded-sm"></div>
                                    </div>
                                </div>
                                <div className="w-full h-12 bg-slate-300 rounded-xl"></div>
                            </div>
                        )}

                        {!loading && !error && resume && (
                            <div className="p-6 rounded-3xl w-full lg:block hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group mt-auto mb-8 lg:mb-0">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="flex items-center gap-5 mb-8 relative z-10">
                                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 shrink-0">
                                        <FaFilePdf size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-black tracking-tight mb-1">
                                            {resume.title || 'Latest Resume'}
                                        </h3>
                                        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] text-slate-600 font-bold">PDF Document</p>
                                    </div>
                                </div>
                                <a
                                    href={resume.resumeUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/btn relative z-10 w-full inline-flex items-center justify-center gap-2 font-mono text-[11px] sm:text-xs uppercase tracking-[0.15em] font-bold text-white border border-slate-900 rounded-lg overflow-hidden px-5 py-3.5 md:px-6 md:py-4 bg-black bg-[length:200%_auto] bg-[position:200%_center] bg-no-repeat transition-all duration-500 ease-in-out hover:border-blue-600 hover:bg-[position:40%_center] shadow-md hover:shadow-indigo-500/25 cursor-pointer"
                                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 531.28 200'%3E%3Cdefs%3E%3Cstyle%3E .shape %7B fill: %232563eb %7D %3C/style%3E%3C/defs%3E%3Cg id='Layer_2' data-name='Layer 2'%3E%3Cg id='Layer_1-2' data-name='Layer 1'%3E%3Cpolygon class='shape' points='415.81 200 0 200 115.47 0 531.28 0 415.81 200' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                                >
                                    <FaDownload className="relative z-10 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
                                    <span className="relative z-10">Download PDF</span>
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Right Side PDF Viewer */}
                    <div className="lg:w-2/3 w-full">
                        {loading ? (
                            <div className="w-full h-[78vh] bg-slate-100 rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-pulse">
                                {/* Toolbar Skeleton */}
                                <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 flex items-center justify-between">
                                    <div className="h-5 w-32 bg-slate-300 rounded-md"></div>
                                    <div className="h-8 w-24 bg-slate-200 rounded-lg"></div>
                                </div>
                                {/* PDF Area Skeleton */}
                                <div className="flex-1 bg-slate-200/50 p-4 sm:p-8 flex justify-center">
                                    <div className="w-full max-w-[600px] h-full bg-white rounded-lg border border-slate-200 shadow-sm"></div>
                                </div>
                                {/* Bottom Controls Skeleton */}
                                <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                                    <div className="h-8 w-40 bg-slate-300 rounded-lg"></div>
                                    <div className="h-8 w-32 bg-slate-200 rounded-lg hidden sm:block"></div>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-[78vh] bg-white rounded-[2rem] border border-rose-100 shadow-sm p-8">
                                <div className="text-center flex flex-col items-center justify-center max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 shadow-sm mb-6">
                                        <span className="text-rose-500 text-2xl">⚠️</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 font-serif mb-2 tracking-tight">
                                        Document Unavailable
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                        {error || "We couldn't load the resume at this time. Please check your connection or try again later."}
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-6 py-3 bg-slate-900 text-white font-mono text-xs uppercase tracking-widest font-bold rounded-xl shadow-lg hover:bg-rose-500 transition-colors cursor-pointer"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        ) : !resume ? (
                            <div className="flex justify-center items-center h-[78vh] bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8">
                                <div className="text-center flex flex-col items-center justify-center max-w-sm mx-auto">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 shadow-sm mb-6">
                                        <FaFilePdf className="text-slate-300 text-2xl" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-800 font-serif mb-2 tracking-tight">
                                        No Resume Found
                                    </h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">
                                        An active resume has not been uploaded yet. Please check back later.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-[78vh] bg-slate-100 rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden flex flex-col" >
                                {/* Toolbar */}
                                <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 z-10 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-black font-serif">Document Preview</h3>
                                        <a
                                            href={resume?.resumeUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg transition cursor-pointer"
                                        >
                                            <FaDownload size={14} />
                                            Download
                                        </a>
                                    </div>
                                </div>

                                {/* PDF Area */}
                                <div
                                    ref={scrollContainerRef}
                                    className="flex-1 overflow-auto bg-slate-100/50 p-4 sm:p-8"
                                    onScroll={handleScroll}
                                >
                                    <div className="w-fit mx-auto min-h-[600px]">
                                        {resume?.resumeUrl ? (
                                            <Document
                                                file={resume.resumeUrl}
                                                onLoadSuccess={onDocumentLoadSuccess}
                                                loading={<div className="p-10 text-slate-500 font-medium">Rendering document...</div>}
                                                error={<div className="p-10 text-rose-500 font-medium">Failed to load document.</div>}
                                                className="flex flex-col gap-8 items-center pb-8"
                                            >
                                                {Array.from(new Array(numPages), (el, index) => (
                                                    <Page
                                                        key={`page_${index + 1}`}
                                                        pageNumber={index + 1}
                                                        scale={scale}
                                                        renderTextLayer={false}
                                                        renderAnnotationLayer={false}
                                                        className="shadow-xl shadow-slate-300/30 border border-slate-200 bg-white rounded-sm overflow-hidden"
                                                    />
                                                ))}
                                            </Document>
                                        ) : (
                                            <div className="h-[800px] flex items-center justify-center text-slate-500">
                                                Resume Preview Not Available
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Controls */}
                                <div className="flex items-center justify-between bg-white border-t border-slate-200 px-6 py-4 flex-shrink-0 z-10">
                                    {/* Left: Pagination */}
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100">
                                            <button 
                                                onClick={() => scrollToPage(pageNumber - 1)}
                                                disabled={pageNumber <= 1}
                                                className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition text-slate-600 cursor-pointer"
                                            >
                                                <FaChevronLeft size={14} />
                                            </button>
                                            <span className="text-xs font-bold font-mono tracking-widest text-slate-600 min-w-[80px] text-center uppercase">
                                                Page {pageNumber} / {numPages || '-'}
                                            </span>
                                            <button 
                                                onClick={() => scrollToPage(pageNumber + 1)}
                                                disabled={pageNumber >= (numPages || 1)}
                                                className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition text-slate-600 cursor-pointer"
                                            >
                                                <FaChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right: Zoom Controls */}
                                    <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100 hidden sm:flex">
                                        <button 
                                            onClick={zoomOut}
                                            disabled={scale <= 0.5}
                                            className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition text-slate-600 cursor-pointer"
                                            title="Zoom Out"
                                        >
                                            <FaSearchMinus size={14} />
                                        </button>
                                        <span className="text-xs font-bold font-mono tracking-wider text-slate-600 min-w-[50px] text-center">
                                            {Math.round(scale * 100)}%
                                        </span>
                                        <button 
                                            onClick={zoomIn}
                                            disabled={scale >= 3.0}
                                            className="p-2 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition text-slate-600 cursor-pointer"
                                            title="Zoom In"
                                        >
                                            <FaSearchPlus size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Resume;
