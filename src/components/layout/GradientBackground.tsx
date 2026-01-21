// import React from "react";

// const GradientBackground: React.FC = () => {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         zIndex: -1,
//         pointerEvents: "none",
//         overflow: "hidden",
//         backgroundColor: "#f8fafc", // slate-50
//       }}
//     >
//       {/* Base gradient */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           background:
//             "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
//         }}
//       />

//       {/* Subtle grid */}
//       <div
//         style={{
//           position: "absolute",
//           inset: 0,
//           backgroundImage: `
//             linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px)
//           `,
//           backgroundSize: "64px 64px",
//         }}
//       />

//       {/* Accent glow (brand color) */}
//       <div
//         style={{
//           position: "absolute",
//           top: "-20%",
//           right: "-10%",
//           width: "600px",
//           height: "600px",
//           background:
//             "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
//           filter: "blur(80px)",
//         }}
//       />

//       {/* Secondary glow */}
//       <div
//         style={{
//           position: "absolute",
//           bottom: "-30%",
//           left: "-15%",
//           width: "700px",
//           height: "700px",
//           background:
//             "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
//           filter: "blur(100px)",
//         }}
//       />
//     </div>
//   );
// };

// export default GradientBackground;


import React from "react";

const GradientBackground: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Base gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 45%, #f1f5f9 100%)",
        }}
      />

      {/* Large geometric diagonal plane */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "120%",
          height: "60%",
          background:
            "linear-gradient(120deg, rgba(16,185,129,0.12), rgba(59,130,246,0.08))",
          transform: "skewY(-8deg)",
        }}
      />

      {/* Secondary geometric plane */}
      <div
        style={{
          position: "absolute",
          bottom: "-25%",
          right: "0%",
          width: "110%",
          height: "55%",
          background:
            "linear-gradient(120deg, rgba(99,102,241,0.1), rgba(236,72,153,0.06))",
          transform: "skewY(6deg)",
        }}
      />

      {/* Geometric line mesh */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(60deg, rgba(15,23,42,0.04) 1px, transparent 1px),
            linear-gradient(-60deg, rgba(15,23,42,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "radial-gradient(circle at center, black 30%, transparent 70%)",
        }}
      />

      {/* Accent glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "20%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 65%)",
          filter: "blur(100px)",
        }}
      />

      {/* Ambient depth glow */}
      <div
        style={{
          position: "absolute",
          bottom: "5%",
          left: "15%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(59,130,246,0.14) 0%, transparent 70%)",
          filter: "blur(130px)",
        }}
      />
    </div>
  );
};

export default GradientBackground;
