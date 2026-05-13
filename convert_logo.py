from PIL import Image

def convert():
    img = Image.open('public/logo.png').convert("RGBA")
    data = img.getdata()
    new_data = []
    
    for item in data:
        r, g, b, a = item
        # If the pixel is mostly dark (gray/black) and has opacity
        if a > 0 and r < 50 and g < 50 and b < 50:
            # Change to white, keeping original opacity
            new_data.append((255, 255, 255, a))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save('public/logo_white.png', 'PNG')
    print("Created logo_white.png")

convert()
