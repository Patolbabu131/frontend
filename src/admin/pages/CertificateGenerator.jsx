import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Ensure this is imported before using useParams
import { BASE_URL } from '../../assets/config'; // Replace with your actual API base URL

const authHeaders = {
  Authorization: 'Bearer your-auth-token', // Replace with your actual auth token
};

export default function CertificateGenerator() {
  const { courseId } = useParams(); // Destructure courseId here after importing useParams
  const [certificateData, setCertificateData] = useState({
    studentName: '',
    courseName: '',
    completionDate: '',
    certificateId: '',
  });

  const svgRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const randomId = 'LS-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    setCertificateData((prevData) => ({
      ...prevData,
      completionDate: formattedDate,
      certificateId: randomId,
    }));

    // Fetch course details
    const fetchCourseDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/courses/${courseId}`, { headers: authHeaders });
        if (!res.ok) {
          console.error('API Error:', res.status, res.statusText);
          throw new Error(`Failed to fetch course details: ${res.statusText}`);
        }
        const jsonResponse = await res.json();
        setCertificateData((prevData) => ({
          ...prevData,
          courseName: jsonResponse.title || 'Unknown Course',
        }));
      } catch (err) {
        console.error('Error fetching course details:', err);
        setCertificateData((prevData) => ({
          ...prevData,
          courseName: 'Unknown Course',
        }));
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCertificateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const downloadSVG = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${certificateData.studentName}-Certificate.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Learningstack Certificate</h1>
      {/* Input Form */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-6">
          <div className="space-y-4">
          <div>
          <label
            htmlFor="studentName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Your Name
          </label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={certificateData.studentName}
            onChange={handleInputChange}
            placeholder="Enter student name"
            className="mt-1 block w-full p-3 border border-gray-300 rounded-2xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition"
          />
        </div>
            <div hidden>
              <label className="block text-gray-700 mb-2" htmlFor="courseName" >
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={certificateData.courseName}
                readOnly
                className="w-full p-3 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div hidden>
              <label className="block text-gray-700 mb-2" htmlFor="completionDate">
                Completion Date
              </label>
              <input
                type="date"
                id="completionDate"
                name="completionDate"
                value={certificateData.completionDate}
                readOnly
                className="w-full p-3 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div hidden>
              <label className="block text-gray-700 mb-2" htmlFor="certificateId">
                Certificate ID
              </label>
              <input
                type="text"
                id="certificateId"
                name="certificateId"
                value={certificateData.certificateId}
                readOnly
                className="w-full p-3 border border-gray-300 rounded bg-gray-100 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
          <div className="pt-4">
            <button
              onClick={downloadSVG}
              disabled={!certificateData.studentName || !certificateData.courseName}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Download Certificate
            </button>
          </div>
        </div>
        {/* Certificate Preview */}
        <div className="bg-white p-4 border border-gray-300 rounded overflow-hidden" hidden>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Certificate Preview</h2>
          <div className="relative" style={{ paddingBottom: '70.7%' }}>
            <svg
              ref={svgRef}
              viewBox="0 0 1000 707"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0 w-full h-full"
            >
              {/* Background with subtle pattern */}
              <rect width="1000" height="707" fill="#fafafa" />
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1" />
              </pattern>
              <rect width="1000" height="707" fill="url(#grid)" />

              {/* Certificate border with geometric patterns */}
              <rect x="40" y="40" width="920" height="627" fill="none" stroke="#d4af37" strokeWidth="3" />
              <rect x="50" y="50" width="900" height="607" fill="none" stroke="#d4af37" strokeWidth="1" />

              {/* Gold corner triangles */}
              <path d="M 40,40 L 40,100 L 100,40 Z" fill="#d4af37" opacity="0.7" />
              <path d="M 960,40 L 960,100 L 900,40 Z" fill="#d4af37" opacity="0.7" />
              <path d="M 40,667 L 40,607 L 100,667 Z" fill="#d4af37" opacity="0.7" />
              <path d="M 960,667 L 960,607 L 900,667 Z" fill="#d4af37" opacity="0.7" />

              {/* Learningstack Text Logo (no circle) */}
              <text x="500" y="100" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="bold" textAnchor="middle" fill="#333">
                LEARNINGSTACK
              </text>

              {/* Certificate Title with embossed effect */}
              <text x="500" y="170" fontFamily="Georgia, serif" fontSize="38" fontWeight="bold" textAnchor="middle" fill="#333">
                Certificate of Achievement
              </text>
              <text x="500" y="171" fontFamily="Georgia, serif" fontSize="38" fontWeight="bold" textAnchor="middle" fill="#888" opacity="0.3">
                Certificate of Achievement
              </text>

              {/* Fixed decorative lines above and below title */}
              <path d="M 200,135 L 800,135" stroke="#d4af37" strokeWidth="2" strokeDasharray="5,3" />
              <path d="M 200,180 L 800,180" stroke="#d4af37" strokeWidth="2" strokeDasharray="5,3" />

              {/* Tagline */}
              <text x="500" y="225" fontFamily="Arial, sans-serif" fontSize="18" fontStyle="italic" textAnchor="middle" fill="#555">
                Empowering Futures Through Education
              </text>

              {/* Certificate Text */}
              <text x="500" y="280" fontFamily="Georgia, serif" fontSize="20" textAnchor="middle" fill="#333">
                This is to certify that
              </text>

              {/* Student Name */}
              <line x1="300" y1="330" x2="700" y2="330" stroke="#333" strokeWidth="1" />
              <text x="500" y="320" fontFamily="Georgia, serif" fontSize="22" fontWeight="bold" textAnchor="middle" fill="#333">
                {certificateData.studentName || '[Student Name]'}
              </text>

              {/* Course Completion Text */}
              <text x="500" y="370" fontFamily="Georgia, serif" fontSize="20" textAnchor="middle" fill="#333">
                has successfully completed the
              </text>

              {/* Course Name */}
              <line x1="300" y1="420" x2="700" y2="420" stroke="#333" strokeWidth="1" />
              <text x="500" y="410" fontFamily="Georgia, serif" fontSize="22" fontWeight="bold" textAnchor="middle" fill="#333">
                {certificateData.courseName || '[Course Name]'}
              </text>

              {/* Achievement Description */}
              <text x="500" y="460" fontFamily="Georgia, serif" fontSize="16" textAnchor="middle" fill="#333">
                <tspan x="500" y="460">
                  This achievement signifies the participant’s ability to understand, analyze, and apply{' '}
                </tspan>
                <tspan x="500" y="485">the knowledge delivered throughout the course.</tspan>
              </text>

              {/* Date and Certificate ID (Left side) */}
              <text x="200" y="550" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#333">
                Date of Completion:
              </text>
              <text x="200" y="575" fontFamily="Arial, sans-serif" fontSize="16" fill="#333">
                {certificateData.completionDate || '[Date]'}
              </text>
              <line x1="185" y1="590" x2="350" y2="590" stroke="#333" strokeWidth="1" />

              <text x="200" y="615" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" fill="#333">
                Certificate ID:
              </text>
              <text x="200" y="640" fontFamily="Arial, sans-serif" fontSize="16" fill="#333">
                {certificateData.certificateId || '[Unique ID Number]'}
              </text>

              {/* Vertical divider line */}
              <line x1="500" y1="530" x2="500" y2="650" stroke="#d4af37" strokeWidth="1" opacity="0.5" />

              {/* Company Details (Right side) - Shortened to fit inside border */}
              <text x="750" y="550" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#333">
                Awarded By:
              </text>
              <text x="750" y="575" fontFamily="Georgia, serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#333">
                Learningstack Education Technologies
              </text>
              <line x1="650" y1="590" x2="850" y2="590" stroke="#333" strokeWidth="1" />
              <text x="750" y="615" fontFamily="Arial, sans-serif" fontSize="16" fontStyle="italic" textAnchor="middle" fill="#555">
                Signature
              </text>

              {/* Company Seal/Watermark */}
              <circle cx="500" cy="353.5" r="250.5" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
              <circle cx="500" cy="353.5" r="200.5" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
              <text x="500" y="353.5" fontFamily="Arial, sans-serif" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#d4af37" opacity="0.5">
                LEARNINGSTACK
              </text>

              {/* Bottom decorative line */}
              <path d="M 200,510 L 800,510" stroke="#d4af37" strokeWidth="2" strokeDasharray="5,3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}