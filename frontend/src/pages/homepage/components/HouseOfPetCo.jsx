import React from 'react';

const items = [
  { src: '/assets/images/essential/Meowsi_.png', label: 'Meowsi' },
  { src: '/assets/images/essential/hearty.png', label: 'Hearty' },
  { src: '/assets/images/essential/Sara.png', label: "Sara's" },
  { src: '/assets/images/essential/dash dog.png', label: 'Dash Dog' }
];

const HouseOfPetCo = () => {
  return (
    <section className="py-10 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-3">From the House of PET&CO</h2>
        <p className="text-lg text-muted-foreground mb-6">Crafted with love, backed by science</p>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {items.map((it) => (
            <div key={it.label} className="text-center">
              <div className="rounded-2xl overflow-hidden bg-white shadow-sm">
                <div className="w-full aspect-square">
                  <img
                    src={it.src}
                    alt={it.label}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/assets/images/no_image.png'; }}
                  />
                </div>
              </div>
              <div className="mt-3 text-base font-semibold text-foreground">{it.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HouseOfPetCo;
