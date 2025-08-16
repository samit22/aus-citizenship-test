import { Box, Typography, Link } from '@mui/material';
import { keyframes } from '@mui/system';

const vapor = keyframes`
  0% { transform: translateY(0) scaleX(1); opacity: 0.6; }
  50% { transform: translateY(-8px) scaleX(1.1); opacity: 0.3; }
  100% { transform: translateY(-16px) scaleX(0.9); opacity: 0; }
`;

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: 'auto',
        backgroundColor: 'grey.100',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Built with ❤️ by <Link href="https://x.com/samit_gh" target="_blank" rel="noopener">Sam</Link>
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Box component="span" sx={{ fontSize: '1.8em' }}>☕</Box>
          <Box
            sx={{
              position: 'absolute',
              top: -5,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.8em',
              animation: `${vapor} 1.5s infinite`,
              '&::before': {
                content: '"💨"',
                position: 'absolute',
                animationDelay: '0.5s',
              },
              '&::after': {
                content: '"💨"',
                position: 'absolute',
                left: 5,
                animationDelay: '1s',
              }
            }}
          >
            💨
          </Box>
        </Box>
        <Box component="span" sx={{ ml: 1 }}>
          Like this site? <Link
            href="https://buymeacoffee.com/samit22"
            target="_blank"
            rel="noopener"
          >
            Buy me a coffee
          </Link>
        </Box>
      </Typography>
    </Box>
  );
}