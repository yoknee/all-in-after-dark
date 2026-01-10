import { useNavigate } from 'react-router-dom'
import { ArtDecoTop, CornerOrnament, CTAButton, ArtDecoLine } from '../components/ArtDecoElements'
import { VIPTreatmentBox } from '../components/VIPTreatmentBox'

export function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-dark-bg font-baskerville text-cream">
      {/* Hero Section */}
      <div className="min-h-screen bg-[rgba(13,8,5,1)] flex justify-center items-center relative overflow-hidden text-[rgba(13,8,5,1)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-[600px] w-full border-[3px] border-gold relative p-10 z-10 text-center" style={{ borderStyle: 'solid', borderWidth: '3px', borderColor: 'rgba(212, 175, 55, 0.75)', borderImage: 'none', boxShadow: 'none', background: 'unset', backgroundImage: 'none', backgroundColor: 'unset' }}>
          {/* Inner border */}
          <div className="absolute top-[15px] left-[15px] right-[15px] bottom-[15px] border border-gold pointer-events-none opacity-50"></div>
          
          {/* Corner ornaments */}
          <CornerOrnament position="top-left" />
          <CornerOrnament position="top-right" />
          <CornerOrnament position="bottom-left" />
          <CornerOrnament position="bottom-right" />
          
          <ArtDecoTop />
          
          <div className="text-[12px] text-light-gold text-center tracking-widest uppercase my-5 font-normal">
            The Night Shift Collective Presents
          </div>
          
          <h1 className="font-playfair text-[44px] font-black text-gold text-center my-5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] tracking-wide leading-tight w-full">
            ALL IN<br />AFTER DARK
          </h1>
          
          <div className="font-playfair text-[24px] text-light-gold text-center italic tracking-wide leading-[1.25]">
            A Speakeasy Havdalah<br />at Senesh's Hidden Door
          </div>
          
          <CTAButton onClick={() => navigate('/register')} className="mt-8 mb-4">
            Reserve Your Spot
          </CTAButton>
          
          <div className="text-sm text-gold italic mb-6">
            Dress to impress.
          </div>
          
          <div className="text-center my-4">
            <div className="text-gold text-xs tracking-widest uppercase mb-1">
              PASSWORD REQUIRED FOR ENTRY
            </div>
            <div className="font-playfair text-base text-cream italic tracking-wide">
              [Revealed upon registration]
            </div>
          </div>
          
          <ArtDecoLine />
          
          <div className="text-center text-cream text-[15px] leading-relaxed my-6 px-5">
            Leave the bedtime negotiations at home and slip into the speakeasy - Havdalah, jazz, craft cocktails, and games that make mingling effortless. Dress to impress.
          </div>
          
          <div className="text-center my-4 text-cream">
            <div className="text-base block text-cream mb-1">Free babysitting included on-site</div>
            <div className="text-sm text-light-gold italic">Senesh students only</div>
          </div>
          
          <div className="mt-8 mb-4">
            <VIPTreatmentBox />
          </div>

          <div className="text-center my-10 text-cream text-[15px] leading-[2.2]">
            <div className="my-3">
              <span className="text-gold font-bold tracking-widest uppercase text-[13px]">When</span>
              <div className="mt-1.5 text-base block">Saturday, January 24th, 2026<br />6:30 PM - 9 PM</div>
            </div>
            <div className="my-3">
              <span className="text-gold font-bold tracking-widest uppercase text-[13px]">Where</span>
              <div className="mt-1.5 text-base block">The Senesh School<br />342 Smith St, Brooklyn, NY 11231</div>
            </div>
          </div>
          
          <div className="mt-7.5">
            <ArtDecoTop />
          </div>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="bg-[rgba(13,8,5,1)] py-8 px-5 text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="font-playfair text-4xl text-gold mb-7.5 tracking-wide">
            What Awaits Behind the Door
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-12">
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">Havdalah to Night Cap</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                Begin with an intimate havdalah ceremony, then transition into the speakeasy revelry.
              </p>
            </div>
            
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">1920s Atmosphere</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                Moody lighting, live jazz, and vintage vibes. Dress code: optional fedoras, mandatory fun.
              </p>
            </div>
            
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">Games & New Friends</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                Fun games + mixers to mingle parents across grades and circles - new friends by night's end.
              </p>
            </div>
            
            <div className="p-5 border border-gold/30 bg-[rgba(212,175,55,0.05)]">
              <h3 className="font-playfair text-2xl text-gold mb-4">Bites, Suds & Spirits</h3>
              <p className="text-light-gold leading-relaxed text-sm">
                Strong pours, smart bites, and just enough indulgence to keep the night lively.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center items-center my-7.5">
            <CTAButton onClick={() => navigate('/register')} className="max-w-[464px]">
              Reserve Your Spot
            </CTAButton>
          </div>
          
          <div className="mt-15 w-full flex flex-col justify-center items-center gap-2" style={{ boxSizing: 'content-box', display: 'flex', flexDirection: 'column' }}>
            <div className="text-xs text-light-gold italic mt-2.5">
            Questions? Find your grade’s contributor via WhatsApp.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

