import React, { useState, useEffect, useRef } from 'react';

const defaultTemplate = {
  id: Date.now().toString(),
  projectName: 'Paket Lokal 1',
  logoImage: null,
  mainTitle: 'LOCAL PACKAGE',
  image: null,
  liquorList: 'BLACK BULL • GILBEY S GIN • GILBEY S VODKA • GILBEY S WHISKEY\nVIBE TEQUILLA • VIBE VODKA • VIBE BLACK TEA • VIBE LYCHEE\nVODKA BLUE • SEAGRAM VODKA • SILVER GIN • VODKA 9 • OMRACH\nNUSA CANA SPICED RUM • NUSA CANA RUM • BLANCO • SMIRNOFF VODKA\nGORDON PINK • MANTA DARK RUM • MANTA WHITE RUM • MANTA SPICED RUM',
  packages: [
    {
      id: 'p1',
      title: '4 LADIES',
      col1Title: '5 HOURS',
      col2Title: '3 HOURS',
      rows: [
        { id: 'r1', label1: '1 BOTTLE', price1: '3400K', label2: '1 BOTTLE', price2: '2900K' },
        { id: 'r2', label1: '2 BOTTLES', price1: '3900K', label2: '2 BOTTLES', price2: '3400K' },
      ]
    },
    {
      id: 'p2',
      title: '2 LADIES',
      col1Title: '5 HOURS',
      col2Title: '3 HOURS',
      rows: [
        { id: 'r1', label1: '1 BOTTLE', price1: '2800K', label2: '1 BOTTLE', price2: '2300K' },
        { id: 'r2', label1: '2 BOTTLES', price1: '3300K', label2: '2 BOTTLES', price2: '2800K' },
      ]
    }
  ],
  includes: 'INCLUDE :\nFREE ROOM • 1 MODIFIER • 1 MIX FRUIT',
  additionalTitle: 'ADDITIONAL : 1 BOTTLE 1000K',
  additionalRows: [
    { id: 'a1', label: '5 HOURS', item1: 'DIAMOND + 450K', item2: 'MODEL + 650K' },
    { id: 'a2', label: '3 HOURS', item1: 'DIAMOND + 400K', item2: 'MODEL + 550K' }
  ]
};

export default function App() {
  const [project, setProject] = useState(defaultTemplate);
  const [savedProjects, setSavedProjects] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const previewRef = useRef(null);

  useEffect(() => {
    const loaded = localStorage.getItem('ktvMenuProjects');
    if (loaded) {
      try {
        setSavedProjects(JSON.parse(loaded));
      } catch (e) {
        console.error(e);
      }
    }
    
    if (!window.html2canvas) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
      document.head.appendChild(script);
    }
  }, []);

  const handleChange = (field, value) => {
    setProject(prev => ({ ...prev, [field]: value }));
  };

  const handlePackageChange = (packageIndex, field, value, rowIndex = null) => {
    setProject(prev => {
      const newPackages = [...prev.packages];
      if (rowIndex !== null) {
        newPackages[packageIndex].rows[rowIndex][field] = value;
      } else {
        newPackages[packageIndex][field] = value;
      }
      return { ...prev, packages: newPackages };
    });
  };

  const handleAdditionalChange = (rowIndex, field, value) => {
    setProject(prev => {
      const newAdditional = [...prev.additionalRows];
      newAdditional[rowIndex][field] = value;
      return { ...prev, additionalRows: newAdditional };
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400; 
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/png');
        handleChange('logoImage', dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/png');
        handleChange('image', dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const saveProject = () => {
    const newProject = { ...project, id: project.id || Date.now().toString() };
    const existingIndex = savedProjects.findIndex(p => p.id === newProject.id);
    let updatedProjects;
    
    if (existingIndex >= 0) {
      updatedProjects = [...savedProjects];
      updatedProjects[existingIndex] = newProject;
    } else {
      updatedProjects = [...savedProjects, newProject];
    }
    
    setSavedProjects(updatedProjects);
    try {
      localStorage.setItem('ktvMenuProjects', JSON.stringify(updatedProjects));
    } catch (err) {
      console.error(err);
    }
    setProject(newProject);
  };

  const loadProject = (id) => {
    const target = savedProjects.find(p => p.id === id);
    if (target) {
      setProject(target);
    }
  };

  const newProject = () => {
    setProject({ ...defaultTemplate, id: Date.now().toString(), projectName: 'Proyek Baru', image: null, logoImage: null });
  };

  const exportPNG = async () => {
    if (!window.html2canvas) {
      return;
    }
    
    setIsExporting(true);
    try {
      const originalScrollY = window.scrollY;
      const originalScrollX = window.scrollX;
      window.scrollTo(0, 0);

      const el = previewRef.current;
      const canvas = await window.html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#151922',
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight
      });
      
      window.scrollTo(originalScrollX, originalScrollY);

      const link = document.createElement('a');
      link.download = `${project.projectName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 text-gray-800 font-sans overflow-hidden">
      
      <div className="md:hidden flex bg-gray-900 text-white shrink-0 shadow-md z-30">
        <button 
          onClick={() => setActiveTab('editor')} 
          className={`flex-1 py-3 text-center text-sm font-semibold transition ${activeTab === 'editor' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}
        >
          ✏️ Editor Menu
        </button>
        <button 
          onClick={() => setActiveTab('preview')} 
          className={`flex-1 py-3 text-center text-sm font-semibold transition ${activeTab === 'preview' ? 'bg-yellow-600 text-white' : 'bg-gray-800 text-gray-300'}`}
        >
          👁️ Lihat Hasil Poster
        </button>
      </div>

      <div className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto print:hidden shadow-lg z-10 shrink-0 ${activeTab === 'preview' ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-gray-900 text-white sticky top-0 z-20 shadow-md">
          <h1 className="text-xl font-bold text-yellow-500 mb-2">Menu Editor</h1>
          <div className="flex gap-2">
            <button onClick={newProject} className="flex-1 bg-gray-700 hover:bg-gray-600 px-2 py-1.5 rounded text-sm transition">Baru</button>
            <button onClick={saveProject} className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white px-2 py-1.5 rounded text-sm transition">Simpan</button>
          </div>
          
          {savedProjects.length > 0 && (
            <div className="mt-3">
              <select 
                className="w-full bg-gray-800 border border-gray-600 rounded p-1.5 text-sm text-white"
                onChange={(e) => loadProject(e.target.value)}
                value={project.id}
              >
                <option disabled value="">-- Muat Proyek Tersimpan --</option>
                {savedProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.projectName}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="p-4 space-y-6 pb-20 md:pb-6">
          <section className="space-y-3">
            <h2 className="font-semibold text-gray-700 border-b pb-1">Pengaturan Umum</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500">Nama Proyek (Untuk Save)</label>
              <input type="text" value={project.projectName} onChange={(e) => handleChange('projectName', e.target.value)} className="w-full border rounded p-2 text-sm mt-1 focus:ring-2 focus:ring-yellow-400 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Gambar Logo (Kiri Atas)</label>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="w-full border rounded p-1 text-sm mt-1" />
              {project.logoImage && (
                <button onClick={() => handleChange('logoImage', null)} className="text-xs text-red-500 mt-1 hover:underline block">Hapus Logo</button>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Judul Utama</label>
              <input type="text" value={project.mainTitle} onChange={(e) => handleChange('mainTitle', e.target.value)} className="w-full border rounded p-2 text-sm mt-1 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Gambar Botol (Tengah)</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded p-1 text-sm mt-1" />
              {project.image && (
                <button onClick={() => handleChange('image', null)} className="text-xs text-red-500 mt-1 hover:underline block">Hapus Gambar</button>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500">Daftar Minuman (Gunakan Enter)</label>
              <textarea value={project.liquorList} onChange={(e) => handleChange('liquorList', e.target.value)} rows="4" className="w-full border rounded p-2 text-xs mt-1 outline-none" />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-gray-700 border-b pb-1">Tabel Harga Paket</h2>
            {project.packages.map((pkg, pIndex) => (
              <div key={pkg.id} className="bg-gray-50 p-3 rounded border shadow-sm space-y-3">
                <input type="text" value={pkg.title} onChange={(e) => handlePackageChange(pIndex, 'title', e.target.value)} className="w-full border rounded p-2 font-bold text-sm bg-white" placeholder="Judul Paket" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                  <div className="flex flex-col min-w-0">
                    <label className="block text-[10px] text-gray-500 mb-1 font-semibold truncate">Jam Kolom 1</label>
                    <input type="text" value={pkg.col1Title} onChange={(e) => handlePackageChange(pIndex, 'col1Title', e.target.value)} className="w-full border rounded p-2 text-xs text-center bg-white font-medium box-border" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <label className="block text-[10px] text-gray-500 mb-1 font-semibold truncate">Jam Kolom 2</label>
                    <input type="text" value={pkg.col2Title} onChange={(e) => handlePackageChange(pIndex, 'col2Title', e.target.value)} className="w-full border rounded p-2 text-xs text-center bg-white font-medium box-border" />
                  </div>
                </div>
                
                {pkg.rows.map((row, rIndex) => (
                  <div key={row.id} className="grid grid-cols-2 gap-2 border-t pt-3 mt-2 border-gray-200">
                    <div className="space-y-1.5 bg-white p-2 rounded border border-gray-100 min-w-0">
                      <input type="text" value={row.label1} onChange={(e) => handlePackageChange(pIndex, 'label1', e.target.value, rIndex)} className="w-full border rounded p-1 text-xs text-center box-border" />
                      <input type="text" value={row.price1} onChange={(e) => handlePackageChange(pIndex, 'price1', e.target.value, rIndex)} className="w-full border rounded p-1 text-xs text-center font-bold text-yellow-600 box-border" />
                    </div>
                    <div className="space-y-1.5 bg-white p-2 rounded border border-gray-100 min-w-0">
                      <input type="text" value={row.label2} onChange={(e) => handlePackageChange(pIndex, 'label2', e.target.value, rIndex)} className="w-full border rounded p-1 text-xs text-center box-border" />
                      <input type="text" value={row.price2} onChange={(e) => handlePackageChange(pIndex, 'price2', e.target.value, rIndex)} className="w-full border rounded p-1 text-xs text-center font-bold text-yellow-600 box-border" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </section>

          <section className="space-y-3 pb-8">
            <h2 className="font-semibold text-gray-700 border-b pb-1">Tambahan & Keterangan</h2>
            <div>
              <label className="block text-xs font-medium text-gray-500">Teks Keterangan Include</label>
              <textarea value={project.includes} onChange={(e) => handleChange('includes', e.target.value)} rows="2" className="w-full border rounded p-2 text-xs mt-1" />
            </div>
            
            <div className="bg-gray-50 p-3 rounded border shadow-sm space-y-2 mt-2">
              <input type="text" value={project.additionalTitle} onChange={(e) => handleChange('additionalTitle', e.target.value)} className="w-full border rounded p-2 text-sm font-bold" />
              {project.additionalRows.map((row, rIndex) => (
                <div key={row.id} className="grid grid-cols-3 gap-1 border-t pt-2">
                  <input type="text" value={row.label} onChange={(e) => handleAdditionalChange(rIndex, 'label', e.target.value)} className="border rounded p-1 text-xs text-center min-w-0" />
                  <input type="text" value={row.item1} onChange={(e) => handleAdditionalChange(rIndex, 'item1', e.target.value)} className="border rounded p-1 text-xs text-center min-w-0" />
                  <input type="text" value={row.item2} onChange={(e) => handleAdditionalChange(rIndex, 'item2', e.target.value)} className="border rounded p-1 text-xs text-center min-w-0" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className={`flex-1 flex flex-col bg-gray-200 overflow-hidden ${activeTab === 'preview' ? 'flex' : 'hidden md:flex'}`}>
        <div className="bg-white p-3 border-b flex justify-between items-center print:hidden shadow-sm z-10 shrink-0">
          <span className="text-gray-600 text-sm hidden md:inline">Hasil poster siap diunduh atau disimpan.</span>
          <div className="flex gap-2 ml-auto w-full md:w-auto justify-end">
            <button onClick={exportPNG} disabled={isExporting} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded shadow-sm text-xs md:text-sm font-medium transition flex items-center gap-2">
              {isExporting ? 'Memproses...' : 'Unduh PNG'}
            </button>
            <button onClick={exportPDF} className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded shadow-sm text-xs md:text-sm font-medium transition flex items-center gap-2">
              Simpan PDF
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center print:p-0 print:overflow-visible items-start">
          <div 
            ref={previewRef}
            id="poster-preview"
            className="relative bg-[#151922] w-full max-w-[600px] border-[8px] border-[#c29b57] p-6 shadow-2xl flex flex-col shrink-0"
            style={{ 
              minHeight: '850px',
              fontFamily: "'Montserrat', sans-serif" 
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <path d="M-50 150 Q 200 50, 600 300" stroke="#c29b57" strokeWidth="2" fill="none" />
                <path d="M400 -50 Q 550 200, 650 600" stroke="#c29b57" strokeWidth="2" fill="none" />
                <path d="M-20 600 Q 150 800, 700 750" stroke="#c29b57" strokeWidth="2" fill="none" />
              </svg>
            </div>

            <div className="flex justify-between items-center mb-6 z-10 relative min-h-[50px]">
              <div className="flex flex-col items-center justify-center w-[150px] h-[50px]">
                 {project.logoImage ? (
                   <img src={project.logoImage} alt="Logo" className="max-w-full max-h-full object-contain" />
                 ) : null}
              </div>
              
              <h1 className="text-[#c29b57] text-3xl font-bold tracking-widest uppercase text-right">
                {project.mainTitle}
              </h1>
            </div>

            <div className="flex-1 min-h-[150px] flex items-center justify-center mb-4 z-10 relative">
              {project.image ? (
                <img src={project.image} alt="Products" className="max-h-[250px] object-contain drop-shadow-2xl" />
              ) : null}
            </div>

            <div className="text-center z-10 relative mb-6 px-4">
              <p className="text-[#c29b57] text-[10px] sm:text-xs font-semibold leading-tight whitespace-pre-wrap uppercase tracking-wide">
                {project.liquorList}
              </p>
            </div>

            <div className="space-y-4 z-10 relative w-[95%] mx-auto">
              {project.packages.map((pkg) => (
                <div key={pkg.id} className="w-full border-2 border-[#c29b57] bg-[#151922]">
                  <div className="w-full bg-[#151922] border-b-2 border-[#c29b57] text-center py-1.5">
                    <h2 className="text-[#c29b57] text-xl font-bold uppercase tracking-wider">{pkg.title}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 w-full border-b-2 border-[#c29b57] bg-[#151922]">
                    <div className="text-center py-1.5 border-r-2 border-[#c29b57]">
                      <span className="text-[#c29b57] font-bold text-base">{pkg.col1Title}</span>
                    </div>
                    <div className="text-center py-1.5">
                      <span className="text-[#c29b57] font-bold text-base">{pkg.col2Title}</span>
                    </div>
                  </div>

                  {pkg.rows.map((row, rIndex) => (
                    <div key={row.id} className={`grid grid-cols-4 w-full ${rIndex > 0 ? 'border-t-2 border-[#c29b57]' : ''}`}>
                      <div className="bg-[#151922] text-center py-2 border-r-2 border-[#c29b57] flex items-center justify-center px-1">
                        <span className="text-[#c29b57] font-semibold text-xs tracking-tight">{row.label1}</span>
                      </div>
                      <div className="bg-[#151922] text-center py-2 border-r-2 border-[#c29b57] flex items-center justify-center px-1">
                        <span className="text-white font-bold text-sm tracking-wide">{row.price1}</span>
                      </div>
                      <div className="bg-[#151922] text-center py-2 border-r-2 border-[#c29b57] flex items-center justify-center px-1">
                        <span className="text-[#c29b57] font-semibold text-xs tracking-tight">{row.label2}</span>
                      </div>
                      <div className="bg-[#151922] text-center py-2 flex items-center justify-center px-1">
                        <span className="text-white font-bold text-sm tracking-wide">{row.price2}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="text-center z-10 relative mt-5 mb-4">
              <p className="text-[#c29b57] text-sm font-bold whitespace-pre-wrap leading-tight">
                {project.includes}
              </p>
            </div>

            <div className="z-10 relative w-[85%] mx-auto pb-4">
              <div className="text-center mb-1">
                <span className="text-[#c29b57] text-sm font-bold uppercase">{project.additionalTitle}</span>
              </div>
              <div className="border-2 border-[#c29b57] flex flex-col bg-[#151922]">
                {project.additionalRows.map((row, i) => (
                  <div key={row.id} className={`grid grid-cols-3 w-full ${i > 0 ? 'border-t-2 border-[#c29b57]' : ''}`}>
                    <div className="bg-[#151922] text-center py-1.5 border-r-2 border-[#c29b57] flex items-center justify-center px-1">
                      <span className="text-[#c29b57] font-bold text-xs">{row.label}</span>
                    </div>
                    <div className="bg-[#151922] text-center py-1.5 border-r-2 border-[#c29b57] flex items-center justify-center px-1">
                      <span className="text-[#c29b57] font-semibold text-[11px]">{row.item1}</span>
                    </div>
                    <div className="bg-[#151922] text-center py-1.5 flex items-center justify-center px-1">
                      <span className="text-[#c29b57] font-semibold text-[11px]">{row.item2}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap');
        
        @media print {
          @page {
            size: auto;
            margin: 0mm;
          }
          body, html {
            background-color: #151922 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #poster-preview, #poster-preview * {
            visibility: visible !important;
          }
          #poster-preview {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
            background-color: #151922 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
