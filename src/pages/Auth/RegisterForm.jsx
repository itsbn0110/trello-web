// TrungQuanDev: https://youtube.com/@trungquandev
import { Link, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import { Card as MuiCard } from '@mui/material';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Zoom from '@mui/material/Zoom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { registerUserAPI } from '~/apis';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
  // PASSWORD_CONFIRMATION_MESSAGE
} from '~/utils/validators';

import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const navigate = useNavigate();
  const submitRegister = (data) => {
    const { email, password } = data;
    toast.promise(registerUserAPI({ email, password }), { pending: 'Registration is in progress...' }).then((user) => {
      navigate(`/login?registeredEmail=${user.email}`);
    });
  };
  return (
    <form onSubmit={handleSubmit(submitRegister)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em',borderRadius:'8px'}}>
          <Box
            sx={{
              margin: '1em',
              display: 'flex',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <LockIcon />
            </Avatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <TrelloIcon />
            </Avatar>
          </Box>
          <Box
            sx={{
              marginTop: '1em',
              display: 'flex',
              justifyContent: 'center',
              fontSize:'1em',
              fontWeight:'500'
            }}
          >
            Sign up to continue
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                // autoComplete="nope"
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password Confirmation..."
                type="password"
                variant="outlined"
                error={!!errors['password_confirmation']}
                {...register('password_confirmation', {
                  validate: (value) => {
                    if (value === watch('password')) return true;
                    return 'Password Confirmation does not match!';
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password_confirmation'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className="interceptor-loading"
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Register
            </Button>
          </CardActions>

          <Typography
            sx={{ textAlign: 'center', margin: '1em 0', color: 'gray',fontStyle:'italic'}}
            variant="body2"
          >
            Or continue with
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2,padding:'0 16px'}}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<GoogleIcon />}
              sx={{ textTransform: 'none' }}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FacebookIcon />}
              sx={{ textTransform: 'none' }}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<TwitterIcon />}
              sx={{ textTransform: 'none' }}
            >
              Twitter
            </Button>
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center',marginTop:'2em' }}>
            <Typography>Already have an account?</Typography>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Log in!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form>
  );
}

export default RegisterForm;
