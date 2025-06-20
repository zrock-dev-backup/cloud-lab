import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import {Cloudinary} from '@cloudinary/url-gen';
import {AdvancedImage} from '@cloudinary/react';
import {fill} from "@cloudinary/url-gen/actions/resize";
import {usePosts} from '../hooks/usePosts';

const cld = new Cloudinary({cloud: {cloudName: 'dookpytjh'}});

export default function PostsPage() {
    const {posts, newPostText, setNewPostText, setSelectedFile, isLoading, error, handleSubmitPost} = usePosts();

    return (
        <Box sx={{p: 4, maxWidth: 800, margin: 'auto'}}>
            <Typography variant="h4" gutterBottom>Posts</Typography>

            {/* Create Post Form */}
            <Card sx={{mb: 4}}>
                <CardContent>
                    <Typography variant="h6">Create a new post</Typography>
                    {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
                    <Box component="form" onSubmit={handleSubmitPost} noValidate>
                        <TextField
                            label="What's on your mind?"
                            multiline
                            rows={3}
                            fullWidth
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            margin="normal"
                            disabled={isLoading}
                        />
                        <Button variant="contained" component="label" disabled={isLoading}>
                            Upload Image
                            <input type="file" hidden accept="image/*"
                                   onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}/>
                        </Button>
                        <Button type="submit" variant="contained" sx={{ml: 2}} disabled={isLoading}>
                            {isLoading ? <CircularProgress size={24}/> : 'Post'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Posts Feed */}
            <Stack spacing={3}>
                {posts.map(post => (
                    <Card key={post.id}>
                        <CardContent>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{mb: 2}}>
                                <Avatar>{post.authorName.charAt(0)}</Avatar>
                                <Typography variant="subtitle1" fontWeight="bold">{post.authorName}</Typography>
                            </Stack>
                            <Typography variant="body1" sx={{mb: 2}}>{post.text}</Typography>
                            <AdvancedImage
                                cldImg={cld.image(post.publicId).resize(fill().width(600).height(400))}
                                style={{maxWidth: '100%', borderRadius: '8px'}}
                            />
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
}
