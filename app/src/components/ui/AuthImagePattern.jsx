const AuthImagePattern = ({ title, subtitle }) => {
    return (
      <div className="hidden lg:flex items-center justify-center bg-gray/20 p-12">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-true_blue/60 
                  ${i % 2 === 0 ? "animate-pulse" : ""}
                `}
              />
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-black">{title}</h2>
          <p className="text-base-content/60 font-medium text-black/70">{subtitle}</p>
        </div>
      </div>
    );
};
  
export default AuthImagePattern;