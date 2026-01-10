import { RegistrationForm } from '../components/RegistrationForm'
import { ArtDecoTop, CornerOrnament } from '../components/ArtDecoElements'

export function Register() {
  return (
    <div className="min-h-screen bg-dark-bg font-baskerville text-cream">
      <div className="min-h-screen bg-[rgba(13,8,5,1)] flex justify-center items-center py-4 px-0 relative overflow-hidden text-[rgba(13,8,5,1)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        
        <div className="max-w-[600px] w-full bg-[rgba(13,8,5,1)] border-[3px] border-gold relative p-10 z-10" style={{ boxShadow: 'none', backgroundImage: 'none' }}>
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
          
          <h1 className="font-playfair text-[48px] font-black text-gold text-center my-5 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.8)] tracking-wide leading-tight w-full">
            ALL IN<br />AFTER DARK
          </h1>
          
          <div className="font-playfair text-[24px] text-light-gold text-center italic tracking-wide leading-[1.25]">
            A Speakeasy Havdalah<br />at Senesh's Hidden Door
          </div>
          
          <div className="mt-8">
            <RegistrationForm />
          </div>
          
          <div className="mt-8">
            <ArtDecoTop />
          </div>
        </div>
      </div>
    </div>
  )
}

