module.exports = {
  theme: {
    extend: {
      keyframes: {
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-12px)",
          },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
      },
    },
  },
};