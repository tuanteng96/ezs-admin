const Card = ({ children }) => (
  <div className="transition bg-white rounded shadow-sm dark:bg-dark-aside">
    {children}
  </div>
)

const Header = ({ children }) => (
  <div className="px-6 py-3 border-b border-separator dark:border-dark-separator min-h-[80px] flex justify-between items-center transition">
    {children}
  </div>
)

const Body = ({ children }) => <div className="px-6 py-5">{children}</div>

const Footer = ({ children }) => (
  <div className="px-6 py-4 border-t border-separator dark:border-dark-separator min-h-[80px] transition">
    {children}
  </div>
)

Card.Header = Header
Card.Body = Body
Card.Footer = Footer

export { Card }
